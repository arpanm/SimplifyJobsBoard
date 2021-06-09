package com.simplify.jobsboard.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.simplify.jobsboard.domain.enumeration.City;
import com.simplify.jobsboard.domain.enumeration.Degree;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.FieldType;

/**
 * A Candidate.
 */
@Entity
@Table(name = "candidate")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "candidate")
public class Candidate implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "email", nullable = false)
    private String email;

    @NotNull
    @Column(name = "mobile", nullable = false)
    private String mobile;

    @Enumerated(EnumType.STRING)
    @Column(name = "degree")
    private Degree degree;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "city")
    private City city;

    @Column(name = "current_salary")
    private Integer currentSalary;

    @OneToMany(mappedBy = "candidate")
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

    public Candidate id(Long id) {
        this.id = id;
        return this;
    }

    public String getEmail() {
        return this.email;
    }

    public Candidate email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return this.mobile;
    }

    public Candidate mobile(String mobile) {
        this.mobile = mobile;
        return this;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public Degree getDegree() {
        return this.degree;
    }

    public Candidate degree(Degree degree) {
        this.degree = degree;
        return this;
    }

    public void setDegree(Degree degree) {
        this.degree = degree;
    }

    public String getDescription() {
        return this.description;
    }

    public Candidate description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public City getCity() {
        return this.city;
    }

    public Candidate city(City city) {
        this.city = city;
        return this;
    }

    public void setCity(City city) {
        this.city = city;
    }

    public Integer getCurrentSalary() {
        return this.currentSalary;
    }

    public Candidate currentSalary(Integer currentSalary) {
        this.currentSalary = currentSalary;
        return this;
    }

    public void setCurrentSalary(Integer currentSalary) {
        this.currentSalary = currentSalary;
    }

    public Set<Application> getApplications() {
        return this.applications;
    }

    public Candidate applications(Set<Application> applications) {
        this.setApplications(applications);
        return this;
    }

    public Candidate addApplication(Application application) {
        this.applications.add(application);
        application.setCandidate(this);
        return this;
    }

    public Candidate removeApplication(Application application) {
        this.applications.remove(application);
        application.setCandidate(null);
        return this;
    }

    public void setApplications(Set<Application> applications) {
        if (this.applications != null) {
            this.applications.forEach(i -> i.setCandidate(null));
        }
        if (applications != null) {
            applications.forEach(i -> i.setCandidate(this));
        }
        this.applications = applications;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Candidate)) {
            return false;
        }
        return id != null && id.equals(((Candidate) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Candidate{" +
            "id=" + getId() +
            ", email='" + getEmail() + "'" +
            ", mobile='" + getMobile() + "'" +
            ", degree='" + getDegree() + "'" +
            ", description='" + getDescription() + "'" +
            ", city='" + getCity() + "'" +
            ", currentSalary=" + getCurrentSalary() +
            "}";
    }
}
