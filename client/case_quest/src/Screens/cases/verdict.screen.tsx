import React, {useState, useEffect, useContext} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Providers/auth.provider';
import { ActivityIncicator } from '../../RC/acitivity.incdicator';
import { getLawyerInformation } from '../../actions/main/home.actions';
import { formatDate } from '../../helper/res.helper';
import { getCase } from '../../actions/main/cases.actions';
import '../../wallet.css'

interface VerdictProps {}

const Verdict: React.FC<VerdictProps> = () => {
        const {logout} = useContext(AuthContext);
        const [loading, setLoading] = useState(true);
        const [uInfo, setUInfo] = useState<any>();
        const location = useLocation();
        const {caseInfo} = location.state
        const [verdict, setVerdict] = useState<any>();
        const navigate = useNavigate();
        const [coloring, setColoring] = useState('');
        
        useEffect(() => {
            console.warn(location.state.caseInfo);
            console.log(location.state)
            setLoading(true);
            if (caseInfo) {
                getCase(location.state.caseInfo._id).then(resp => {
                    console.log(resp)
                    setVerdict(resp.case.verdict);
                    setColoring(resp.case.verdict.status == 'lost' ? 'losscoloring' : 'wincoloring')
                getLawyerInformation(caseInfo.owners[0]).then(res => {
                    setUInfo(res.userInfo);
                    setLoading(false);
                }).catch(err => logout())
            }).catch(err => console.log(err));
            }
        }, [])
    
        return (
            loading ? <ActivityIncicator fullScreen /> : (
                <div className="pctr">
                <div className="container wctr cov-parent clr d-flex  justify-content-center overflow-auto">
                <div className="h-c">
                    <h2>Verdict</h2>
                </div>
                <div className="verdictinfo-container">
                    <p><b>Title : </b>{caseInfo.title}</p>
                    <p><b>Prosecuting Attorney : </b>{caseInfo.prosecution == uInfo._id ? `${uInfo.firstName} ${uInfo.lastName}` : caseInfo.prosecution}</p>
                    <p><b>Defense Attorney : </b>{caseInfo.defense == uInfo._id ? `${uInfo.firstName} ${uInfo.lastName}` : caseInfo.defense}</p>
                    <p><b>Summary : </b>{caseInfo.summary}</p>
                    <p className='hightlightverdict'><b>Verdict :</b> {verdict.verdict}</p>
                    <p className={coloring}><b>Compensation : </b>{verdict.compensation} $</p>
                    <p className={coloring}><b>Reputation Points : </b>{verdict.rptnpts}</p>
                    <p><b>Performance : </b>{verdict.score} / 100</p>
                    <p><b>Status : </b>{verdict.status}</p>
                    <p><b>Started on : </b>{formatDate(caseInfo.date)}</p>
                </div>
            </div>
            </div>
        )
        )
    
}

export default Verdict
