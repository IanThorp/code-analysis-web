# Code Analysis

See comments in `index.html` for instructions.

I ended up really only modifying the css.

The biggest fixes were the broken "sortByLastName" and filter.

Filter was only returning names that 100% matched the input string. This should just be names the include the input string.

sortByLastName simply returned sortByFirstName in reverse. The easiest way to do this was to add a lastName property to the object upon getting from the api. 

View notes in JS file for more details. 

## Run

Open `index.html` in Google Chrome.

## Style Guide

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally
- Consider starting the commit message with an applicable emoji:
    - **Improvements**
        - :art: `:art:` when improving the format/structure of the code
        - :fire: `:fire:` when removing code or files
        - :tada: `:tada:` when adding a feature
        - :goat: `:goat:` when improving performance
    - **Misc**
        - :memo: `:memo:` when writing docs
    - **Dependencies**
        - :arrow_up: `:arrow_up:` when upgrading dependencies
        - :arrow_down: `:arrow_down:` when downgrading dependencies

### React Styles

- Always favor stateless components

