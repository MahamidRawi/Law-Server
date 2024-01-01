import React, {useState, useEffect} from 'react';
import { balanceParser, formatDate } from '../../helper/res.helper';
import { useNavigate } from 'react-router-dom';
import './wallet.css';

interface IncomeCardProp {
    data: any,
    type: 'Income' | 'Expense'
}

const IncomeCard: React.FC<IncomeCardProp> = ({data, type}) => {
    const navigate = useNavigate();
    return (
        <div className="container py-3 record-dimension card">
        <div className="row">
              <div className="card-body d-flex align-items-center">
                <div className="flex-grow-1">
                  <p className="mb-2"><b>{type == 'Income' ? 'From :' : 'To : '}</b> {data.from}</p>
                  <p className="mb-2"><b>Amount :</b> <span style={{color: 'green'}}> + {balanceParser(data.amount)}</span></p>
                  <p className="mb-2"><b>Date :</b> {formatDate(data.date)}</p>
                  
                </div>
                <div className="d-flex flex-column">
                  <button className="btn btn-outline-primary" onClick={() => navigate('/Mail', {state: {targetMail: data.email}})}>Contact</button>
                </div>
              </div>
            </div>
          </div>
    )
}

export {IncomeCard}