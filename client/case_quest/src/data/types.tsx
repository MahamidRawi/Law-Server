export type UserCase = Array<{
        title: string,
        defense: string,
        prosecution: string,
        summary: string,
        participants: Array<string> ,
        difficulty: string,
        owners: Array<string>
        _id: string 
    }>

export type UserInfo = {
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    wallet: Array<any>,
    score: number,
    balance: number,
    notifications: Array<any>
}

export type NotificationsProps = Array<{ title: string, body: string, viewMore?: boolean }>
