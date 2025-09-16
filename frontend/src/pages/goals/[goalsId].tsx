import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'

import { Field, Form, Formik } from 'formik'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import { SelectField } from "../../components/SelectField";
import { SelectFieldMany } from "../../components/SelectFieldMany";
import { SwitchField } from '../../components/SwitchField'
import {RichTextField} from "../../components/RichTextField";

import { update, fetch } from '../../stores/goals/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditGoals = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    user: null,

    'goal_type': '',

    'target_reduction': '',

    achieved: false,

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { goals } = useAppSelector((state) => state.goals)

  const { goalsId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: goalsId }))
  }, [goalsId])

  useEffect(() => {
    if (typeof goals === 'object') {
      setInitialValues(goals)
    }
  }, [goals])

  useEffect(() => {
      if (typeof goals === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (goals)[el])

          setInitialValues(newInitialVal);
      }
  }, [goals])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: goalsId, data }))
    await router.push('/goals/goals-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit goals')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit goals'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

    <FormField label='User' labelFor='user'>
        <Field
            name='user'
            id='user'
            component={SelectField}
            options={initialValues.user}
            itemRef={'users'}

            showField={'firstName'}

        ></Field>
    </FormField>

    <FormField
        label="GoalType"
    >
        <Field
            name="goal_type"
            placeholder="GoalType"
        />
    </FormField>

    <FormField
        label="TargetReduction(%)"
    >
        <Field
            type="number"
            name="target_reduction"
            placeholder="TargetReduction(%)"
        />
    </FormField>

    <FormField label='Achieved' labelFor='achieved'>
        <Field
            name='achieved'
            id='achieved'
            component={SwitchField}
        ></Field>
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/goals/goals-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditGoals.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditGoals
