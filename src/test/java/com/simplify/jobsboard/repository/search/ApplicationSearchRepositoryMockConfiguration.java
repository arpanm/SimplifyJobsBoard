package com.simplify.jobsboard.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link ApplicationSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class ApplicationSearchRepositoryMockConfiguration {

    @MockBean
    private ApplicationSearchRepository mockApplicationSearchRepository;
}
