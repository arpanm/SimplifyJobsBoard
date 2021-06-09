package com.simplify.jobsboard.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.FieldType;

/**
 * A Application.
 */
@Entity
@Table(name = "application")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "application")
public class Application implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_time")
    private LocalDate applicationTime;

    @Column(name = "desired_salary")
    private Integer desiredSalary;

    @Column(name = "years_of_experice_on_this_role")
    private Integer yearsOfExpericeOnThisRole;

    @ManyToOne
    @JsonIgnoreProperties(value = { "applications" }, allowSetters = true)
    private Job job;

    @ManyToOne
    @JsonIgnoreProperties(value = { "applications" }, allowSetters = true)
    private Candidate candidate;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Application id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getApplicationTime() {
        return this.applicationTime;
    }

    public Application applicationTime(LocalDate applicationTime) {
        this.applicationTime = applicationTime;
        return this;
    }

    public void setApplicationTime(LocalDate applicationTime) {
        this.applicationTime = applicationTime;
    }

    public Integer getDesiredSalary() {
        return this.desiredSalary;
    }

    public Application desiredSalary(Integer desiredSalary) {
        this.desiredSalary = desiredSalary;
        return this;
    }

    public void setDesiredSalary(Integer desiredSalary) {
        this.desiredSalary = desiredSalary;
    }

    public Integer getYearsOfExpericeOnThisRole() {
        return this.yearsOfExpericeOnThisRole;
    }

    public Application yearsOfExpericeOnThisRole(Integer yearsOfExpericeOnThisRole) {
        this.yearsOfExpericeOnThisRole = yearsOfExpericeOnThisRole;
        return this;
    }

    public void setYearsOfExpericeOnThisRole(Integer yearsOfExpericeOnThisRole) {
        this.yearsOfExpericeOnThisRole = yearsOfExpericeOnThisRole;
    }

    public Job getJob() {
        return this.job;
    }

    public Application job(Job job) {
        this.setJob(job);
        return this;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public Candidate getCandidate() {
        return this.candidate;
    }

    public Application candidate(Candidate candidate) {
        this.setCandidate(candidate);
        return this;
    }

    public void setCandidate(Candidate candidate) {
        this.candidate = candidate;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Application)) {
            return false;
        }
        return id != null && id.equals(((Application) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Application{" +
            "id=" + getId() +
            ", applicationTime='" + getApplicationTime() + "'" +
            ", desiredSalary=" + getDesiredSalary() +
            ", yearsOfExpericeOnThisRole=" + getYearsOfExpericeOnThisRole() +
            "}";
    }
}
