import * as fs from 'fs'
import { cleanAndSplitUserInput } from '../../utils'
import { Gender, JobTitle } from '../../@types'
import { User } from './User'
import { WORDS_TO_IGNORE } from '../../constants'
import csvParse = require('csv-parse')
import getStream = require('get-stream')

export class UserService {
    public static getUsers = async (): Promise<User[]> => {
        let users: User[] = []
        const parseStream = csvParse({ delimiter: ',' })
        const data = await getStream.array(
            fs.createReadStream(`Sample Profiles.csv`).pipe(parseStream)
        )

        for (let i = 1; i < data.length; i++) {
            const parsedUser: string[] = data[i] as string[]
            const user: User = new User()
            user.id = parseInt(parsedUser[0])
            user.companyId = parseInt(parsedUser[1])
            user.companyName = parsedUser[2]
            user.name = parsedUser[3]
            user.age = parseInt(parsedUser[4])
            user.gender = UserService.parseGender(parsedUser[5])
            user.location = parsedUser[6].toLowerCase()
            user.jobTitle = UserService.parseJobTitle(parsedUser[7])
            user.identityKeywords = UserService.parseIdentity(parsedUser[8])
            user.interests = UserService.parseInterests(parsedUser[9])
            user.howToMeet = UserService.parseHowToMeet(parsedUser[10])

            // Add gender as more identity
            user.identityKeywords.add(user.gender)

            users.push(user)
        }

        // Sort users by those with few interests first as they will be most difficult
        // to match
        users = users.sort((userA, userB) => (userA.interests.size < userB.interests.size ? -1 : 1))

        return users
    }

    /**
     * Returns gender string as @type Gender
     * @param genderString
     */
    private static parseGender = (genderString: string): Gender => {
        let gender: Gender | undefined

        const genderStringLc = genderString.toLowerCase()

        switch (genderStringLc) {
            case `male`:
                gender = 'male'
                break

            case `female`:
                gender = 'female'
                break

            default:
                gender = 'unknown gender'
        }

        return gender
    }

    private static parseHowToMeet = (howToMeetString: string): Set<string> => {
        const words = cleanAndSplitUserInput(howToMeetString)

        for (const word of words) {
            if (WORDS_TO_IGNORE.HOW_TO_MEET.includes(word) || word.length === 0) {
                words.delete(word)
            }
        }

        return words
    }

    private static parseIdentity = (identityString: string): Set<string> => {
        const words = cleanAndSplitUserInput(identityString)

        for (let word of words) {
            if (WORDS_TO_IGNORE.IDENTITY.includes(word) || word.length === 0) {
                words.delete(word)
            } else {
                if (word === `america`) {
                    word = `american`
                }
            }
        }

        return words
    }

    private static parseInterests = (interestString: string): Set<string> => {
        const words = cleanAndSplitUserInput(interestString)

        for (const word of words) {
            if (WORDS_TO_IGNORE.INTERESTS.includes(word) || word.length === 0) {
                words.delete(word)
            }
        }

        return words
    }

    /**
     * Returns jobTitleString as @type JobTitle
     * @param jobTitleString
     */
    private static parseJobTitle = (jobTitleString: string): JobTitle => {
        let jobTitle: JobTitle = 'engineer'

        const jobTitleStringLc = jobTitleString.toLowerCase()

        if (jobTitleStringLc.includes(`qa`)) {
            jobTitle = 'quality assurance'
        } else if (jobTitleStringLc.includes(`design`)) {
            jobTitle = 'designer'
        } else if (jobTitleStringLc.includes(`product manager`)) {
            jobTitle = 'product manager'
        } else if (jobTitleStringLc.includes(`project manager`)) {
            jobTitle = 'project manager'
        } else if (jobTitleStringLc.includes(`office manager`)) {
            jobTitle = 'office manager'
        } else if (jobTitleStringLc.includes(`quality assurance manager`)) {
            jobTitle = 'quality assurance manager'
        } else if (jobTitleStringLc.includes(`engineering manager`)) {
            jobTitle = 'engineering manager'
        } else if (jobTitleStringLc.includes(`exec`)) {
            jobTitle = 'exec'
        } else if (jobTitleStringLc.includes(`business`)) {
            jobTitle = 'biz dev'
        }

        return jobTitle
    }
}

export { User } from './User'
