package com.simplify.jobsboard.repository.search;

import com.simplify.jobsboard.domain.Candidate;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Candidate} entity.
 */
public interface CandidateSearchRepository extends ElasticsearchRepository<Candidate, Long> {}
