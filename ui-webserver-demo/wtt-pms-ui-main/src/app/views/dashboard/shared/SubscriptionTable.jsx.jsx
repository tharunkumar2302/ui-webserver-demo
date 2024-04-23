import {
  Avatar,
  Box,
  Card,
  Icon,
  IconButton,
  MenuItem,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import { Paragraph } from 'app/components/Typography';
import { useState, useEffect } from 'react';
import { getDashboardPricingPlanDetails } from "app/redux/actions/CommonActions";

const CardHeader = styled(Box)(() => ({
  display: 'flex',
  paddingLeft: '24px',
  paddingRight: '24px',
  marginBottom: '12px',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const Title = styled('span')(() => ({
  fontSize: '1rem',
  fontWeight: '500',
  textTransform: 'capitalize',
}));

const ProductTable = styled(Table)(() => ({
  minWidth: 400,
  whiteSpace: 'pre',
  '& small': {
    width: 50,
    height: 15,
    borderRadius: 500,
    boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)',
  },
  '& td': { borderBottom: 'none' },
  '& td:first-of-type': { paddingLeft: '16px !important' },
}));

const Small = styled('small')(({ bgcolor }) => ({
  width: 50,
  height: 15,
  color: '#fff',
  padding: '2px 8px',
  borderRadius: '4px',
  overflow: 'hidden',
  background: bgcolor,
  boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)',
}));

const SubscriptionTable = () => {
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgPrimary = palette.primary.main;
  const bgSecondary = palette.secondary.main;
  
  const [emailActual, setEmailActual] = useState(0);
  const [emailValue, setEmailValue] = useState(0);
  const [emailRemaining, setEmailRemaining] = useState(0);
  const [dashboardTable, setDashboardTable] = useState([
  ]);

  const [profileActual, setProfileActual] = useState(0);
  const [profileValue, setProfileValue] = useState(0);
  const [profileRemaining, setProfileRemaining] = useState(0);

  const [recruiterActual, setRecruiterActual] = useState(0);
  const [recruiterValue, setRecruiterValue] = useState(0);
  const [recruiterRemaining, setRecruiterRemaining] = useState(0);


  useEffect(() => {
      getDashboardPricingPlanDetails().then((users)=> 
      {
        getRules(users);
      }
      );
  }, []);


  const getRules = (data)=>{
    const dashboardPricingPlanApi = data?.payload.result;
    const rows = [];
    if (dashboardPricingPlanApi) {
      const emailRestriction = dashboardPricingPlanApi?.find(
        (rule) => rule.rule_Code === "EMAIL_RESTRICTION"
      );
      if (emailRestriction) {
        rows.push({
          actual: emailRestriction.actual, 
          remaining: emailRestriction.remaining, 
          total: emailRestriction.value,
          ruleCode: emailRestriction.rule_Code, 
          name:"Email Usage"
        })
        // setEmailActual(emailRestriction.actual);
        // setEmailValue(emailRestriction.value);
        // setEmailRemaining(emailRestriction.remaining);
      }
  
      const profileRestriction = dashboardPricingPlanApi?.find(
        (rule) => rule.rule_Code === 'PROFILES_RESTRICTION'
      );
      if (profileRestriction) {
        rows.push({
          actual: profileRestriction.actual, 
          remaining: profileRestriction.remaining, 
          total: profileRestriction.value,
          ruleCode: profileRestriction.rule_Code,
          name:"profile Usage" 
        })
        // setProfileActual(profileRestriction.actual);
        // setProfileValue(profileRestriction.value);
        // setProfileRemaining(profileRestriction.remaining);
      }
  
      const recruiterRestriction = dashboardPricingPlanApi?.find(
        (rule) => rule.rule_Code === 'RECRUITER_RESTRICTION'
      );
      if (recruiterRestriction) {
        rows.push({
          actual: recruiterRestriction.actual, 
          remaining: recruiterRestriction.remaining, 
          total: recruiterRestriction.value,
          ruleCode: recruiterRestriction.rule_Code, 
          name:"Recruiter Usage"
        })
        // setRecruiterActual(recruiterRestriction.actual);
        // setRecruiterValue(recruiterRestriction.value);
        // setRecruiterRemaining(recruiterRestriction.remaining);
      }
    }
    setDashboardTable(rows);
   }
  

  return (
    <Card elevation={3} sx={{ pt: '20px', mb: 3 }}>
      <CardHeader>
        <Title>Subscription Usage</Title>
        {/* <Select size="small" defaultValue="this_month">
          <MenuItem value="this_month">This Month</MenuItem>
          <MenuItem value="last_month">Last Month</MenuItem>
        </Select> */}
      </CardHeader>
      <Box overflow="auto">
        <ProductTable>
          <TableHead>
            <TableRow>
              <TableCell sx={{ px: 3 }} colSpan={1}>
                Name
              </TableCell>
              <TableCell sx={{ px: 2 }} colSpan={1}>
                Quota
              </TableCell>
              <TableCell sx={{ px: 0 }} colSpan={1}>
                Used
              </TableCell>
              <TableCell sx={{ px: 0 }} colSpan={1}>
                Remaining
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {dashboardTable.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell colSpan={1} align="left" sx={{ px: 0, textTransform: 'capitalize' }}>
                  <Box display="flex" alignItems="center">
                    {/* <Avatar src={row.imgUrl} /> */}
                    <Paragraph sx={{ m: 0, ml: 1 }}>{row.name}</Paragraph>
                  </Box>
                </TableCell>

                <TableCell align="left" colSpan={1} sx={{ px: 2, textTransform: 'capitalize' }}>
                {row.total}
                </TableCell>
                <TableCell sx={{ px: 0 }} colSpan={1}>
                 {row.actual}
                 </TableCell>
                 <TableCell sx={{ px: 0 }} align="left" colSpan={1}>
                    {(row.remaining || row.remaining === 0) && row.total? (
                      row.remaining / row.total * 100 >= 25 ? ( // Adjust the percentage condition as needed
                        <Small bgcolor={bgPrimary}>{row.remaining}</Small>
                      ) : (
                        <Small bgcolor={bgError}>{row.remaining}</Small>
                      )
                    ) : row.remaining}
                  </TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </ProductTable>
      </Box>
      
    </Card>
  );
};



export default SubscriptionTable;
