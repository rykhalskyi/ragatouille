### [Optional] Once Before tests [ ]
    * [Condition: if 'element' exists]
        - click 'element'
        - [other actions...]

### 1. [Step Name] [ ]
    * [Optional Condition: if 'element' is visible/enabled/exists]
        - [Conditional Action]

    # Actions (start with -)
    - click 'data-test-id'
    - click "button name" 'data-test-id'
    - input to 'data-test-id' 'value'
    - select in 'data-test-id' 'option'
    - wait until 'data-test-id' hidden
    - wait until 'data-test-id' visible
    - (script: path/to/script.js)

    # Asserts (start with *)
    * 'data-test-id' is visible
    * 'data-test-id' is hidden
    * 'data-test-id' is enabled
    * 'data-test-id' is disabled
    * text shown 'data-test-id' 'expected text'
    * 'data-test-id' contains 'expected text'
    * [element] shown 'data-test-id'
    * [element] hidden 'data-test-id'

### 2. [Next Step Name] [ ]
    (script: path/to/script.js)

    - [Add actions following the pattern above]
    * [Add asserts following the pattern above]

# Placeholders:
#   (script: path/to/script.js) - insert whole Playwright script
#   (import recording "path/to/recording.json") - import recording
#   [Optional] - optional block
#   [ ] - checkbox for completion
