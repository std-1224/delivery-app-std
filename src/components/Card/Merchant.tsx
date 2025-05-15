import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Card } from '@mui/material';

import { IMerchant } from '../../types/MerchantTypes';

interface IProps {
  merchant: IMerchant | undefined,
}

const MerchantCard = (props: IProps) => {  
  const { merchant } = props;
  const navigate = useNavigate();

  return (
    <Card
      sx={{ 
        boxShadow: 3,
        cursor: "pointer",
        minHeight: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        background: "white"
      }}
      onClick={() => {navigate("/merchants/" + merchant?.id)}}>
      <img src={merchant?.logo} alt="" width={150} />
    </Card>
  );
};

export default MerchantCard;
