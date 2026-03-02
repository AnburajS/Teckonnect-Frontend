import React, { useEffect } from 'react';
import EmailTemplateFrom from './EmailTemplateFrom';
import { useLocation } from 'react-router-dom';
import { getEmailTemplates } from '../../store/emailTemplateThunk';
import { useDispatch, useSelector } from 'react-redux';

function UpdateEmailTemplate() {
  const location = useLocation();
  const dispatch = useDispatch();
  const routerData = location.state;
  const { data } = useSelector(
    (state) => state.emailTemplate?.getEmailTemplateSingle
  );

  useEffect(() => {
    dispatch(getEmailTemplates({ id: routerData?.data?.id }));
  }, [routerData?.data?.id]);
  return (
    <div>
      {' '}
      <EmailTemplateFrom
        tilte={'Modify Template'}
        data={data?.response}
      />
    </div>
  );
}

export default UpdateEmailTemplate;
