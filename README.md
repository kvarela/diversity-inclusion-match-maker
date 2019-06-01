# Swirl.io Technical Assessment

## To run

1. `yarn` to get all necessary dependencies
2. `yarn start` to run script

Matches show up in `Matches.csv`

## Methodology

1. Parsed profile data into User objects, making sure to sanitize identity and interest fields and transform them into lists.
2. Sorted Users by number of interests ascending since it will be more difficult to match users with fewer interests, and matching diverse users who share interests is important
3. For each user, iterate through the rest of the unmatched users and find the user who shares the most common interests.
4. If the user doesn't share any common interests, then match them with the user whom they scored highest with. Score is calculated as numCommonInterests + numIdentityDifferences + numCommonHowToMeet
5. Match them up
6. Write out matches to csv and store in `Matches.csv`

Note: The sample output only lists `gender` as an identity difference between Jeremy and Eileen.
I thought it would be more useful to catalog ALL their identity differences. Maybe later we can classify the various gender differences into `gender`, `ethnicity`, `socio-economic`, `religous`, etc...

## Architecture

1. Using Typescript on top of javascript as I work faster and with less errors coding in Typescript
1. Entry point for program is `src/index.ts`, utilized `commander` for easy command-line utilities
1. Utilized a couple libs like `csv-parse` for parsing CSV files and `get-stream` for streaming CSV file into object. Other than that, it's vanilla javascript.
1. Types in `src/@types`
1. UserService in `src/services` is responsible for parsing, classifying, and sanitzing
1. MatchingService in `src/services` is responsible for matching users with one another
1. `src/utils` has miscellaneous utils
