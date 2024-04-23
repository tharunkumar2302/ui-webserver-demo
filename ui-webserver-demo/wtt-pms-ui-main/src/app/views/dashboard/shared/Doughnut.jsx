/* eslint-disable eqeqeq */
import React from 'react'
import { useTheme } from '@mui/system'
import ReactEcharts from 'echarts-for-react'
import { localStorageCandidate } from 'app/utils/constant'
import { pieBasicDetails, pieEducationDetails, pieExperienceDetails, pieNewUploadsByCandidates, pieNewUploadsByRecruiter, pieProfessionalInformation, pieResumesDeactivated } from 'app/utils/constantForms'

const DoughnutChart = ({ height, width, color = [], deactivatedResumes, uploadByRecruter, uploadByCandidate, basicDetailsPercentage, educationDetailsPercentage, experienceDetailsPercentage, professionalInfoPercentage }) => {
    const theme = useTheme()

    const option = {
        legend: {
            show: true,
            itemGap: 15,
            icon: 'circle',
            bottom: 0,
            textStyle: {
                color: theme.palette.text.secondary,
                fontSize: 13,
                fontFamily: 'roboto',
            },
        },
        tooltip: {
            show: false,
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        xAxis: [
            {
                axisLine: {
                    show: false,
                },
                splitLine: {
                    show: false,
                },
            },
        ],
        yAxis: [
            {
                axisLine: {
                    show: false,
                },
                splitLine: {
                    show: false,
                },
            },
        ],

        series: [
            {
                name: 'Profile',
                type: 'pie',
                radius: ['45%', '72.55%'],
                center: ['50%', '37%'],
                avoidLabelOverlap: false,
                hoverOffset: 5,
                stillShowZeroSum: false,
                label: {
                    normal: {
                        show: true,
                        position: 'inside', // shows the description data to center, turn off to show in right side
                        textStyle: {
                            color: 'black',
                            fontSize: 13,
                            fontFamily: 'roboto',
                        },
                        formatter: (localStorage.getItem('userRole') === 'candidate' ? ((uploadByRecruter == undefined && uploadByCandidate == undefined && deactivatedResumes == undefined) && (!basicDetailsPercentage && !educationDetailsPercentage && !experienceDetailsPercentage && !professionalInfoPercentage) ? '' : '{d}% ') : ((uploadByRecruter == 0 && uploadByCandidate == 0 && deactivatedResumes == 0) && (!basicDetailsPercentage && !educationDetailsPercentage && !experienceDetailsPercentage && !professionalInfoPercentage) ? '' : '{d}%')),

                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '9',
                            fontWeight: '500'
                        },
                        formatter: '{b} \n{c} ({d}%)',
                    },
                },
                labelLine: {
                    normal: {
                        show: false,
                    },
                },
                data: [
                    {
                        value: localStorageCandidate()?.role?.name === 'candidate' ? educationDetailsPercentage : uploadByRecruter,
                        name: localStorageCandidate()?.role?.name === 'candidate' ? pieEducationDetails : pieNewUploadsByRecruiter,
                    },
                    {
                        value: localStorageCandidate()?.role?.name === 'candidate' ? experienceDetailsPercentage : uploadByCandidate,
                        name: localStorageCandidate()?.role?.name === 'candidate' ? pieExperienceDetails : pieNewUploadsByCandidates,
                    },
                    {
                        value: localStorageCandidate()?.role?.name === 'candidate' ? basicDetailsPercentage : deactivatedResumes,
                        name: localStorageCandidate()?.role?.name === 'candidate' ? pieBasicDetails : pieResumesDeactivated
                    },
                    {
                        value: localStorageCandidate()?.role?.name === 'candidate' && professionalInfoPercentage,
                        name: localStorageCandidate()?.role?.name === 'candidate' && pieProfessionalInformation
                    },
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
        title: {
            show: true,
            textStyle: {
                color: '#bcbcbc',
                fontSize: '12px',
                fontWeight: '500',
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif'
            },
            text: (localStorage.getItem('userRole') === 'candidate' ? ((uploadByRecruter == undefined && uploadByCandidate == undefined && deactivatedResumes == undefined) && (!basicDetailsPercentage && !educationDetailsPercentage && !experienceDetailsPercentage && !professionalInfoPercentage) ? 'No Data Found' : ' ') : ((uploadByRecruter == 0 && uploadByCandidate == 0 && deactivatedResumes == 0) && (!basicDetailsPercentage && !educationDetailsPercentage && !experienceDetailsPercentage && !professionalInfoPercentage) ? 'No Data Found' : ' ')),
            left: 'center',
            top: 'center'
        },
    }

    return (
        <ReactEcharts
            style={{ height: height, width: width }}
            option={{
                ...option,
                color: [...color],
            }}
        />
    )
}

export default DoughnutChart
