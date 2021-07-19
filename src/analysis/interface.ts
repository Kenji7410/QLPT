export type ICustomRoom = IRoom & { kindOfRoom: IKindOfRoom };

export type ICustomAgreements = (IAgreement & { room: ICustomRoom })[];

export interface AnalysisPageProps {}

export interface RevenueProps extends AnalysisPageProps {}
