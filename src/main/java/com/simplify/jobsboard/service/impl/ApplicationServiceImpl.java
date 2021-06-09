package com.simplify.jobsboard.service.impl;

import static org.elasticsearch.index.query.QueryBuilders.*;

import com.simplify.jobsboard.domain.Application;
import com.simplify.jobsboard.repository.ApplicationRepository;
import com.simplify.jobsboard.repository.search.ApplicationSearchRepository;
import com.simplify.jobsboard.service.ApplicationService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Application}.
 */
@Service
@Transactional
public class ApplicationServiceImpl implements ApplicationService {

    private final Logger log = LoggerFactory.getLogger(ApplicationServiceImpl.class);

    private final ApplicationRepository applicationRepository;

    private final ApplicationSearchRepository applicationSearchRepository;

    public ApplicationServiceImpl(ApplicationRepository applicationRepository, ApplicationSearchRepository applicationSearchRepository) {
        this.applicationRepository = applicationRepository;
        this.applicationSearchRepository = applicationSearchRepository;
    }

    @Override
    public Application save(Application application) {
        log.debug("Request to save Application : {}", application);
        Application result = applicationRepository.save(application);
        applicationSearchRepository.save(result);
        return result;
    }

    @Override
    public Optional<Application> partialUpdate(Application application) {
        log.debug("Request to partially update Application : {}", application);

        return applicationRepository
            .findById(application.getId())
            .map(
                existingApplication -> {
                    if (application.getApplicationTime() != null) {
                        existingApplication.setApplicationTime(application.getApplicationTime());
                    }
                    if (application.getDesiredSalary() != null) {
                        existingApplication.setDesiredSalary(application.getDesiredSalary());
                    }
                    if (application.getYearsOfExpericeOnThisRole() != null) {
                        existingApplication.setYearsOfExpericeOnThisRole(application.getYearsOfExpericeOnThisRole());
                    }

                    return existingApplication;
                }
            )
            .map(applicationRepository::save)
            .map(
                savedApplication -> {
                    applicationSearchRepository.save(savedApplication);

                    return savedApplication;
                }
            );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Application> findAll(Pageable pageable) {
        log.debug("Request to get all Applications");
        return applicationRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Application> findOne(Long id) {
        log.debug("Request to get Application : {}", id);
        return applicationRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Application : {}", id);
        applicationRepository.deleteById(id);
        applicationSearchRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Application> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Applications for query {}", query);
        return applicationSearchRepository.search(queryStringQuery(query), pageable);
    }
}
