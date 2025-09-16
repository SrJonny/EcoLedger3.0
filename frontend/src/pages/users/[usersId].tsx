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

import { update, fetch } from '../../stores/users/usersSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditUsers = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'firstName': '',

    'lastName': '',

    'phoneNumber': '',

    'email': '',

    disabled: false,

    password: ''

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { users } = useAppSelector((state) => state.users)

  const { usersId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: usersId }))
  }, [usersId])

  useEffect(() => {
    if (typeof users === 'object') {
      setInitialValues(users)
    }
  }, [users])

  useEffect(() => {
      if (typeof users === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (users)[el])

          setInitialValues(newInitialVal);
      }
  }, [users])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: usersId, data }))
    await router.push('/users/users-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit users')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit users'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

    <FormField
        label="First Name"
    >
        <Field
            name="firstName"
            placeholder="First Name"
        />
    </FormField>

    <FormField
        label="Last Name"
    >
        <Field
            name="lastName"
            placeholder="Last Name"
        />
    </FormField>

    <FormField
        label="Phone Number"
    >
        <Field
            name="phoneNumber"
            placeholder="Phone Number"
        />
    </FormField>

    <FormField
        label="E-Mail"
    >
        <Field
            name="email"
            placeholder="E-Mail"
        />
    </FormField>

    <FormField label='Disabled' labelFor='disabled'>
        <Field
            name='disabled'
            id='disabled'
            component={SwitchField}
        ></Field>
    </FormField>

    <FormField
        label="Password"
    >
        <Field
            name="password"
            placeholder="password"
        />
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/users/users-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditUsers.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditUsers
