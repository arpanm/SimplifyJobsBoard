package com.simplify.jobsboard.service.impl;

import static org.elasticsearch.index.query.QueryBuilders.*;

import com.simplify.jobsboard.domain.Candidate;
import com.simplify.jobsboard.repository.CandidateRepository;
import com.simplify.jobsboard.repository.search.CandidateSearchRepository;
import com.simplify.jobsboard.service.CandidateService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Candidate}.
 */
@Service
@Transactional
public class CandidateServiceImpl implements CandidateService {

    private final Logger log = LoggerFactory.getLogger(CandidateServiceImpl.class);

    private final CandidateRepository candidateRepository;

    private final CandidateSearchRepository candidateSearchRepository;

    public CandidateServiceImpl(CandidateRepository candidateRepository, CandidateSearchRepository candidateSearchRepository) {
        this.candidateRepository = candidateRepository;
        this.candidateSearchRepository = candidateSearchRepository;
    }

    @Override
    public Candidate save(Candidate candidate) {
        log.debug("Request to save Candidate : {}", candidate);
        Candidate result = candidateRepository.save(candidate);
        candidateSearchRepository.save(result);
        return result;
    }

    @Override
    public Optional<Candidate> partialUpdate(Candidate candidate) {
        log.debug("Request to partially update Candidate : {}", candidate);

        return candidateRepository
            .findById(candidate.getId())
            .map(
                existingCandidate -> {
                    if (candidate.getEmail() != null) {
                        existingCandidate.setEmail(candidate.getEmail());
                    }
                    if (candidate.getMobile() != null) {
                        existingCandidate.setMobile(candidate.getMobile());
                    }
                    if (candidate.getDegree() != null) {
                        existingCandidate.setDegree(candidate.getDegree());
                    }
                    if (candidate.getDescription() != null) {
                        existingCandidate.setDescription(candidate.getDescription());
                    }
                    if (candidate.getCity() != null) {
                        existingCandidate.setCity(candidate.getCity());
                    }
                    if (candidate.getCurrentSalary() != null) {
                        existingCandidate.setCurrentSalary(candidate.getCurrentSalary());
                    }

                    return existingCandidate;
                }
            )
            .map(candidateRepository::save)
            .map(
                savedCandidate -> {
                    candidateSearchRepository.save(savedCandidate);

                    return savedCandidate;
                }
            );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Candidate> findAll(Pageable pageable) {
        log.debug("Request to get all Candidates");
        return candidateRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Candidate> findOne(Long id) {
        log.debug("Request to get Candidate : {}", id);
        return candidateRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Candidate : {}", id);
        candidateRepository.deleteById(id);
        candidateSearchRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Candidate> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Candidates for query {}", query);
        return candidateSearchRepository.search(queryStringQuery(query), pageable);
    }
}
