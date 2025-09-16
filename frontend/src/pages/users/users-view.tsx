import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/users/usersSlice'
import dataFormatter from '../../helpers/dataFormatter';
import LayoutAuthenticated from "../../layouts/Authenticated";
import {getPageTitle} from "../../config";
import SectionTitleLineWithButton from "../../components/SectionTitleLineWithButton";
import SectionMain from "../../components/SectionMain";
import CardBox from "../../components/CardBox";
import BaseButton from "../../components/BaseButton";
import BaseDivider from "../../components/BaseDivider";
import {mdiChartTimelineVariant} from "@mdi/js";
import {SwitchField} from "../../components/SwitchField";
import FormField from "../../components/FormField";

const UsersView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { users } = useAppSelector((state) => state.users)

    const { id } = router.query;

    function removeLastCharacter(str) {
      console.log(str,`str`)
      return str.slice(0, -1);
    }

    useEffect(() => {
        dispatch(fetch({ id }));
    }, [dispatch, id]);

    return (
      <>
          <Head>
              <title>{getPageTitle('View users')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View users')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/users/users-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>First Name</p>
                    <p>{users?.firstName}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Last Name</p>
                    <p>{users?.lastName}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Phone Number</p>
                    <p>{users?.phoneNumber}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>E-Mail</p>
                    <p>{users?.email}</p>
                </div>

                <FormField label='Disabled'>
                    <SwitchField
                      field={{name: 'disabled', value: users?.disabled}}
                      form={{setFieldValue: () => null}}
                      disabled
                    />
                </FormField>

                <>
                    <p className={'block font-bold mb-2'}>Activities User</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>ActivityType</th>

                                <th>Date</th>

                                <th>Emissions(kgCO2)</th>

                            </tr>
                            </thead>
                            <tbody>
                            {users.activities_user && Array.isArray(users.activities_user) &&
                              users.activities_user.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/activities/activities-view/?id=${item.id}`)}>

                                    <td data-label="activity_type">
                                        { item.activity_type }
                                    </td>

                                    <td data-label="date">
                                        { dataFormatter.dateTimeFormatter(item.date) }
                                    </td>

                                    <td data-label="emissions">
                                        { item.emissions }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!users?.activities_user?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <>
                    <p className={'block font-bold mb-2'}>Dashboards User</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>WeeklyEmissions(kgCO2)</th>

                                <th>MonthlyEmissions(kgCO2)</th>

                                <th>Points</th>

                                <th>Badges</th>

                            </tr>
                            </thead>
                            <tbody>
                            {users.dashboards_user && Array.isArray(users.dashboards_user) &&
                              users.dashboards_user.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/dashboards/dashboards-view/?id=${item.id}`)}>

                                    <td data-label="weekly_emissions">
                                        { item.weekly_emissions }
                                    </td>

                                    <td data-label="monthly_emissions">
                                        { item.monthly_emissions }
                                    </td>

                                    <td data-label="points">
                                        { item.points }
                                    </td>

                                    <td data-label="badges">
                                        { item.badges }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!users?.dashboards_user?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <>
                    <p className={'block font-bold mb-2'}>Goals User</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>GoalType</th>

                                <th>TargetReduction(%)</th>

                                <th>Achieved</th>

                            </tr>
                            </thead>
                            <tbody>
                            {users.goals_user && Array.isArray(users.goals_user) &&
                              users.goals_user.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/goals/goals-view/?id=${item.id}`)}>

                                    <td data-label="goal_type">
                                        { item.goal_type }
                                    </td>

                                    <td data-label="target_reduction">
                                        { item.target_reduction }
                                    </td>

                                    <td data-label="achieved">
                                        { dataFormatter.booleanFormatter(item.achieved) }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!users?.goals_user?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <>
                    <p className={'block font-bold mb-2'}>Reports Admin</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>GeneratedOn</th>

                                <th>TotalReduction(kgCO2)</th>

                            </tr>
                            </thead>
                            <tbody>
                            {users.reports_admin && Array.isArray(users.reports_admin) &&
                              users.reports_admin.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/reports/reports-view/?id=${item.id}`)}>

                                    <td data-label="generated_on">
                                        { dataFormatter.dateTimeFormatter(item.generated_on) }
                                    </td>

                                    <td data-label="total_reduction">
                                        { item.total_reduction }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!users?.reports_admin?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <>
                    <p className={'block font-bold mb-2'}>Tokens User</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>TokenBalance</th>

                            </tr>
                            </thead>
                            <tbody>
                            {users.tokens_user && Array.isArray(users.tokens_user) &&
                              users.tokens_user.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/tokens/tokens-view/?id=${item.id}`)}>

                                    <td data-label="balance">
                                        { item.balance }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!users?.tokens_user?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/users/users-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

UsersView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default UsersView;
