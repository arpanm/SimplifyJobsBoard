package com.simplify.jobsboard.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.simplify.jobsboard.IntegrationTest;
import com.simplify.jobsboard.domain.Application;
import com.simplify.jobsboard.repository.ApplicationRepository;
import com.simplify.jobsboard.repository.search.ApplicationSearchRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ApplicationResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ApplicationResourceIT {

    private static final LocalDate DEFAULT_APPLICATION_TIME = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_APPLICATION_TIME = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_DESIRED_SALARY = 1;
    private static final Integer UPDATED_DESIRED_SALARY = 2;

    private static final Integer DEFAULT_YEARS_OF_EXPERICE_ON_THIS_ROLE = 1;
    private static final Integer UPDATED_YEARS_OF_EXPERICE_ON_THIS_ROLE = 2;

    private static final String ENTITY_API_URL = "/api/applications";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";
    private static final String ENTITY_SEARCH_API_URL = "/api/_search/applications";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ApplicationRepository applicationRepository;

    /**
     * This repository is mocked in the com.simplify.jobsboard.repository.search test package.
     *
     * @see com.simplify.jobsboard.repository.search.ApplicationSearchRepositoryMockConfiguration
     */
    @Autowired
    private ApplicationSearchRepository mockApplicationSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restApplicationMockMvc;

    private Application application;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Application createEntity(EntityManager em) {
        Application application = new Application()
            .applicationTime(DEFAULT_APPLICATION_TIME)
            .desiredSalary(DEFAULT_DESIRED_SALARY)
            .yearsOfExpericeOnThisRole(DEFAULT_YEARS_OF_EXPERICE_ON_THIS_ROLE);
        return application;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Application createUpdatedEntity(EntityManager em) {
        Application application = new Application()
            .applicationTime(UPDATED_APPLICATION_TIME)
            .desiredSalary(UPDATED_DESIRED_SALARY)
            .yearsOfExpericeOnThisRole(UPDATED_YEARS_OF_EXPERICE_ON_THIS_ROLE);
        return application;
    }

    @BeforeEach
    public void initTest() {
        application = createEntity(em);
    }

    @Test
    @Transactional
    void createApplication() throws Exception {
        int databaseSizeBeforeCreate = applicationRepository.findAll().size();
        // Create the Application
        restApplicationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(application)))
            .andExpect(status().isCreated());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeCreate + 1);
        Application testApplication = applicationList.get(applicationList.size() - 1);
        assertThat(testApplication.getApplicationTime()).isEqualTo(DEFAULT_APPLICATION_TIME);
        assertThat(testApplication.getDesiredSalary()).isEqualTo(DEFAULT_DESIRED_SALARY);
        assertThat(testApplication.getYearsOfExpericeOnThisRole()).isEqualTo(DEFAULT_YEARS_OF_EXPERICE_ON_THIS_ROLE);

        // Validate the Application in Elasticsearch
        verify(mockApplicationSearchRepository, times(1)).save(testApplication);
    }

    @Test
    @Transactional
    void createApplicationWithExistingId() throws Exception {
        // Create the Application with an existing ID
        application.setId(1L);

        int databaseSizeBeforeCreate = applicationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restApplicationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(application)))
            .andExpect(status().isBadRequest());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeCreate);

        // Validate the Application in Elasticsearch
        verify(mockApplicationSearchRepository, times(0)).save(application);
    }

    @Test
    @Transactional
    void getAllApplications() throws Exception {
        // Initialize the database
        applicationRepository.saveAndFlush(application);

        // Get all the applicationList
        restApplicationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(application.getId().intValue())))
            .andExpect(jsonPath("$.[*].applicationTime").value(hasItem(DEFAULT_APPLICATION_TIME.toString())))
            .andExpect(jsonPath("$.[*].desiredSalary").value(hasItem(DEFAULT_DESIRED_SALARY)))
            .andExpect(jsonPath("$.[*].yearsOfExpericeOnThisRole").value(hasItem(DEFAULT_YEARS_OF_EXPERICE_ON_THIS_ROLE)));
    }

    @Test
    @Transactional
    void getApplication() throws Exception {
        // Initialize the database
        applicationRepository.saveAndFlush(application);

        // Get the application
        restApplicationMockMvc
            .perform(get(ENTITY_API_URL_ID, application.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(application.getId().intValue()))
            .andExpect(jsonPath("$.applicationTime").value(DEFAULT_APPLICATION_TIME.toString()))
            .andExpect(jsonPath("$.desiredSalary").value(DEFAULT_DESIRED_SALARY))
            .andExpect(jsonPath("$.yearsOfExpericeOnThisRole").value(DEFAULT_YEARS_OF_EXPERICE_ON_THIS_ROLE));
    }

    @Test
    @Transactional
    void getNonExistingApplication() throws Exception {
        // Get the application
        restApplicationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewApplication() throws Exception {
        // Initialize the database
        applicationRepository.saveAndFlush(application);

        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();

        // Update the application
        Application updatedApplication = applicationRepository.findById(application.getId()).get();
        // Disconnect from session so that the updates on updatedApplication are not directly saved in db
        em.detach(updatedApplication);
        updatedApplication
            .applicationTime(UPDATED_APPLICATION_TIME)
            .desiredSalary(UPDATED_DESIRED_SALARY)
            .yearsOfExpericeOnThisRole(UPDATED_YEARS_OF_EXPERICE_ON_THIS_ROLE);

        restApplicationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedApplication.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedApplication))
            )
            .andExpect(status().isOk());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);
        Application testApplication = applicationList.get(applicationList.size() - 1);
        assertThat(testApplication.getApplicationTime()).isEqualTo(UPDATED_APPLICATION_TIME);
        assertThat(testApplication.getDesiredSalary()).isEqualTo(UPDATED_DESIRED_SALARY);
        assertThat(testApplication.getYearsOfExpericeOnThisRole()).isEqualTo(UPDATED_YEARS_OF_EXPERICE_ON_THIS_ROLE);

        // Validate the Application in Elasticsearch
        verify(mockApplicationSearchRepository).save(testApplication);
    }

    @Test
    @Transactional
    void putNonExistingApplication() throws Exception {
        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();
        application.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restApplicationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, application.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(application))
            )
            .andExpect(status().isBadRequest());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Application in Elasticsearch
        verify(mockApplicationSearchRepository, times(0)).save(application);
    }

    @Test
    @Transactional
    void putWithIdMismatchApplication() throws Exception {
        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();
        application.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restApplicationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(application))
            )
            .andExpect(status().isBadRequest());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Application in Elasticsearch
        verify(mockApplicationSearchRepository, times(0)).save(application);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamApplication() throws Exception {
        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();
        application.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restApplicationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(application)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Application in Elasticsearch
        verify(mockApplicationSearchRepository, times(0)).save(application);
    }

    @Test
    @Transactional
    void partialUpdateApplicationWithPatch() throws Exception {
        // Initialize the database
        applicationRepository.saveAndFlush(application);

        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();

        // Update the application using partial update
        Application partialUpdatedApplication = new Application();
        partialUpdatedApplication.setId(application.getId());

        partialUpdatedApplication.applicationTime(UPDATED_APPLICATION_TIME);

        restApplicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedApplication.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedApplication))
            )
            .andExpect(status().isOk());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);
        Application testApplication = applicationList.get(applicationList.size() - 1);
        assertThat(testApplication.getApplicationTime()).isEqualTo(UPDATED_APPLICATION_TIME);
        assertThat(testApplication.getDesiredSalary()).isEqualTo(DEFAULT_DESIRED_SALARY);
        assertThat(testApplication.getYearsOfExpericeOnThisRole()).isEqualTo(DEFAULT_YEARS_OF_EXPERICE_ON_THIS_ROLE);
    }

    @Test
    @Transactional
    void fullUpdateApplicationWithPatch() throws Exception {
        // Initialize the database
        applicationRepository.saveAndFlush(application);

        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();

        // Update the application using partial update
        Application partialUpdatedApplication = new Application();
        partialUpdatedApplication.setId(application.getId());

        partialUpdatedApplication
            .applicationTime(UPDATED_APPLICATION_TIME)
            .desiredSalary(UPDATED_DESIRED_SALARY)
            .yearsOfExpericeOnThisRole(UPDATED_YEARS_OF_EXPERICE_ON_THIS_ROLE);

        restApplicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedApplication.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedApplication))
            )
            .andExpect(status().isOk());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);
        Application testApplication = applicationList.get(applicationList.size() - 1);
        assertThat(testApplication.getApplicationTime()).isEqualTo(UPDATED_APPLICATION_TIME);
        assertThat(testApplication.getDesiredSalary()).isEqualTo(UPDATED_DESIRED_SALARY);
        assertThat(testApplication.getYearsOfExpericeOnThisRole()).isEqualTo(UPDATED_YEARS_OF_EXPERICE_ON_THIS_ROLE);
    }

    @Test
    @Transactional
    void patchNonExistingApplication() throws Exception {
        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();
        application.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restApplicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, application.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(application))
            )
            .andExpect(status().isBadRequest());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Application in Elasticsearch
        verify(mockApplicationSearchRepository, times(0)).save(application);
    }

    @Test
    @Transactional
    void patchWithIdMismatchApplication() throws Exception {
        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();
        application.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restApplicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(application))
            )
            .andExpect(status().isBadRequest());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Application in Elasticsearch
        verify(mockApplicationSearchRepository, times(0)).save(application);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamApplication() throws Exception {
        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();
        application.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restApplicationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(application))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Application in Elasticsearch
        verify(mockApplicationSearchRepository, times(0)).save(application);
    }

    @Test
    @Transactional
    void deleteApplication() throws Exception {
        // Initialize the database
        applicationRepository.saveAndFlush(application);

        int databaseSizeBeforeDelete = applicationRepository.findAll().size();

        // Delete the application
        restApplicationMockMvc
            .perform(delete(ENTITY_API_URL_ID, application.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Application in Elasticsearch
        verify(mockApplicationSearchRepository, times(1)).deleteById(application.getId());
    }

    @Test
    @Transactional
    void searchApplication() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        applicationRepository.saveAndFlush(application);
        when(mockApplicationSearchRepository.search(queryStringQuery("id:" + application.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(application), PageRequest.of(0, 1), 1));

        // Search the application
        restApplicationMockMvc
            .perform(get(ENTITY_SEARCH_API_URL + "?query=id:" + application.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(application.getId().intValue())))
            .andExpect(jsonPath("$.[*].applicationTime").value(hasItem(DEFAULT_APPLICATION_TIME.toString())))
            .andExpect(jsonPath("$.[*].desiredSalary").value(hasItem(DEFAULT_DESIRED_SALARY)))
            .andExpect(jsonPath("$.[*].yearsOfExpericeOnThisRole").value(hasItem(DEFAULT_YEARS_OF_EXPERICE_ON_THIS_ROLE)));
    }
}
