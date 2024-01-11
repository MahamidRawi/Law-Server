import { ReactElement } from "react";
import ActionScreen from "../Screens/cases/caseActions/actions.screen";
import CaseOverView from "../Screens/cases/caseActions/case.overview";
import Participants from "../Screens/cases/caseActions/case.participants";
import DiscoveryScreen from "../Screens/cases/caseActions/discoveries.screen";
import { RecordsScreen } from "../Screens/wallet/wallet.records";
import TransferScreen from "../Screens/wallet/wallet.transfer";

const SignInArray = [
    'email',
    'password'
]

const SignUpArray = [
    'firstName',
    'lastName',
    'username',
    'email',
    'password'
]

interface ContentMap {
    [key: string]: ReactElement;
}

export type {ContentMap}
export {SignInArray, SignUpArray}