Feature: Journeyman Integration

  Scenario: Session is stored across visits
    Given I visit the server with new parameters
    When I visit the server again
    Then I see those parameters on the page
