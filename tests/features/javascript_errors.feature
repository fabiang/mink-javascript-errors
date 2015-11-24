Feature: JavaScript errors are catched and are turned into exceptions

  @javascript
  Scenario: Visiting test page should collect JS errors
    Given I am on "/test.html"
    Then I should have 3 collected JavaScript errors
    And Error 1 should be of type "error" with message "Error: first error"
    And Error 2 should be of type "error" with message "Error: second error"
    And Error 3 should be of type "ajaxError" with message "Unknown error"
