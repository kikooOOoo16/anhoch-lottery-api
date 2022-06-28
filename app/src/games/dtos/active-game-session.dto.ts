import {Expose, Transform} from "class-transformer";

export class ActiveGameSessionDTO {
    @Expose()
    @Transform(({obj}) => obj._id)
    sessionId: string;

    @Expose()
    @Transform(({obj}) => obj.user._id)
    userId: string;

    @Expose()
    @Transform(({obj}) => obj.game._id)
    gameId: string;

    @Expose()
    startTimeStamp: number;
}