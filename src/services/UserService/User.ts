import { JobTitle } from '../../@types'

export class User {
    public id!: number
    public companyId!: number
    public companyName!: string
    public name!: string
    public age!: number
    public gender!: string
    public location!: string
    public jobTitle!: JobTitle
    public identityKeywords!: Set<string>
    public interests!: Set<string>
    public howToMeet!: Set<string>
}
