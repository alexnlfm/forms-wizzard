import { useContext, useState, useEffect } from 'react';
import { toLower } from 'lodash';

// Components
import FormWrapper from '../common/FormWrapper';
import Footer from '../common/Footer';
import TextInput from '../common/TextInput';

import StateMachineContext from '../StateMachineContext';
import { BASIC_DETAILS, ADVANCED_DETAILS_TYPE_1, ADVANCED_DETAILS_TYPE_2, stateNamesMap } from '../states';
import { fetchData } from '../services';

const BasicDetails = () => {
   const [_, setState] = useContext(StateMachineContext);
   const [registrationMethods, setRegistrationMethods] = useState([]);

   useEffect(() => {
      fetchData('registration-methods').then((data) => {
         setRegistrationMethods(data);
      });
   }, []);

   return (
      <FormWrapper
         title="Personal Information"
         description="Please enter your full name and prefered registration method"
         onFormSubmit={(formData) => {
            const registrationMethod = formData.get('registration-method');
            const dataObj = {
               firstName: formData.get('first-name'),
               lastName: formData.get('last-name'),
               registrationMethod,
            };
            if (registrationMethod) {
               const state = registrationMethod === 'phone' ? ADVANCED_DETAILS_TYPE_1 : ADVANCED_DETAILS_TYPE_2;
               setState(state, dataObj);
            }
         }}
         footer={<Footer mainBtnText={`Submit ${toLower(stateNamesMap[BASIC_DETAILS])}`} resetButton />}
      >
         <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <TextInput name="first-name" label="First name" />
            <TextInput name="last-name" label="Last name" />
         </div>

         <div className="mt-10 space-y-10">
            <fieldset>
               <legend className="text-sm font-semibold leading-6 text-gray-900">Registration method</legend>
               <div className="mt-6 space-y-6">
                  {registrationMethods.length === 0 ? (
                     <div>Loading...</div>
                  ) : (
                     registrationMethods.map(({ id, name, displayedName }) => (
                        <RadioInput key={id} name={name} label={displayedName} />
                     ))
                  )}
               </div>
            </fieldset>
         </div>
      </FormWrapper>
   );
};

type RadioInputProps = {
   name: string;
   label: string;
};
const RadioInput = ({ name, label }: RadioInputProps) => (
   <div className="flex items-center gap-x-3">
      <input
         type="radio"
         id={name}
         name="registration-method"
         className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
         value={name}
      />
      <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
         {label}
      </label>
   </div>
);

export default BasicDetails;
