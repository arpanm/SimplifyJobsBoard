package com.simplify.jobsboard.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.simplify.jobsboard.domain.enumeration.City;
import com.simplify.jobsboard.domain.enumeration.Degree;
import com.simplify.jobsboard.domain.enumeration.JobType;
import com.simplify.jobsboard.domain.enumeration.LocationType;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.FieldType;

/**
 * A Job.
 */
@Entity
@Table(name = "job")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "job")
public class Job implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "role")
    private String role;

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    @Column(name = "min_salary")
    private Integer minSalary;

    @Column(name = "max_salary")
    private Integer maxSalary;

    @Enumerated(EnumType.STRING)
    @Column(name = "degree")
    private Degree degree;

    @Enumerated(EnumType.STRING)
    @Column(name = "location_type")
    private LocationType locationType;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type")
    private JobType jobType;

    @Enumerated(EnumType.STRING)
    @Column(name = "city")
    private City city;

    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "creator_email", nullable = false)
    private String creatorEmail;

    @NotNull
    @Column(name = "creator_mobile", nullable = false)
    private String creatorMobile;

    @Column(name = "created_time")
    private LocalDate createdTime;

    @OneToMany(mappedBy = "job")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "job", "candidate" }, allowSetters = true)
    private Set<Application> applications = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Job id(Long id) {
        this.id = id;
        return this;
    }

    public String getTitle() {
        return this.title;
    }

    public Job title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getRole() {
        return this.role;
    }

    public Job role(String role) {
        this.role = role;
        return this;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Integer getYearsOfExperience() {
        return this.yearsOfExperience;
    }

    public Job yearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
        return this;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public Integer getMinSalary() {
        return this.minSalary;
    }

    public Job minSalary(Integer minSalary) {
        this.minSalary = minSalary;
        return this;
    }

    public void setMinSalary(Integer minSalary) {
        this.minSalary = minSalary;
    }

    public Integer getMaxSalary() {
        return this.maxSalary;
    }

    public Job maxSalary(Integer maxSalary) {
        this.maxSalary = maxSalary;
        return this;
    }

    public void setMaxSalary(Integer maxSalary) {
        this.maxSalary = maxSalary;
    }

    public Degree getDegree() {
        return this.degree;
    }

    public Job degree(Degree degree) {
        this.degree = degree;
        return this;
    }

    public void setDegree(Degree degree) {
        this.degree = degree;
    }

    public LocationType getLocationType() {
        return this.locationType;
    }

    public Job locationType(LocationType locationType) {
        this.locationType = locationType;
        return this;
    }

    public void setLocationType(LocationType locationType) {
        this.locationType = locationType;
    }

    public JobType getJobType() {
        return this.jobType;
    }

    public Job jobType(JobType jobType) {
        this.jobType = jobType;
        return this;
    }

    public void setJobType(JobType jobType) {
        this.jobType = jobType;
    }

    public City getCity() {
        return this.city;
    }

    public Job city(City city) {
        this.city = city;
        return this;
    }

    public void setCity(City city) {
        this.city = city;
    }

    public String getDescription() {
        return this.description;
    }

    public Job description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCreatorEmail() {
        return this.creatorEmail;
    }

    public Job creatorEmail(String creatorEmail) {
        this.creatorEmail = creatorEmail;
        return this;
    }

    public void setCreatorEmail(String creatorEmail) {
        this.creatorEmail = creatorEmail;
    }

    public String getCreatorMobile() {
        return this.creatorMobile;
    }

    public Job creatorMobile(String creatorMobile) {
        this.creatorMobile = creatorMobile;
        return this;
    }

    public void setCreatorMobile(String creatorMobile) {
        this.creatorMobile = creatorMobile;
    }

    public LocalDate getCreatedTime() {
        return this.createdTime;
    }

    public Job createdTime(LocalDate createdTime) {
        this.createdTime = createdTime;
        return this;
    }

    public void setCreatedTime(LocalDate createdTime) {
        this.createdTime = createdTime;
    }

    public Set<Application> getApplications() {
        return this.applications;
    }

    public Job applications(Set<Application> applications) {
        this.setApplications(applications);
        return this;
    }

    public Job addApplication(Application application) {
        this.applications.add(application);
        application.setJob(this);
        return this;
    }

    public Job removeApplication(Application application) {
        this.applications.remove(application);
        application.setJob(null);
        return this;
    }

    public void setApplications(Set<Application> applications) {
        if (this.applications != null) {
            this.applications.forEach(i -> i.setJob(null));
        }
        if (applications != null) {
            applications.forEach(i -> i.setJob(this));
        }
        this.applications = applications;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Job)) {
            return false;
        }
        return id != null && id.equals(((Job) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Job{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", role='" + getRole() + "'" +
            ", yearsOfExperience=" + getYearsOfExperience() +
            ", minSalary=" + getMinSalary() +
            ", maxSalary=" + getMaxSalary() +
            ", degree='" + getDegree() + "'" +
            ", locationType='" + getLocationType() + "'" +
            ", jobType='" + getJobType() + "'" +
            ", city='" + getCity() + "'" +
            ", description='" + getDescription() + "'" +
            ", creatorEmail='" + getCreatorEmail() + "'" +
            ", creatorMobile='" + getCreatorMobile() + "'" +
            ", createdTime='" + getCreatedTime() + "'" +
            "}";
    }
}
