import { User } from '../UserService'

export class Match {
    public userA!: User
    public userB!: User
    public identityDifference?: Set<string>
    public commonInterests?: Set<string>
    public commonHowToMeet?: Set<string>
}
