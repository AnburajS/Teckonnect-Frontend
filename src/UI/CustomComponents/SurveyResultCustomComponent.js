import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const SurveyResultCustomComponent = (props) => {
  const { data, markImportantUnimportant, deleteSurvey, republishSurvey } =
    props;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );

  const importantUnimportantHandler = (importantState) => {
    markImportantUnimportant({ isImportant: importantState, sData: data });
  };

  const deleteSurveyHandler = () => {
    deleteSurvey(data);
  };

  const republishSurveyHandler = () => {
    republishSurvey(data);
  };

  return (
    <React.Fragment>
      <div className="ans-type text-center c1">
        <span
          className="eep_kebab_btn"
          data-toggle="dropdown"
          aria-expanded="false"
          dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.colon }}
        ></span>
        <div className="eep-dropdown-menu dropdown-menu dropdown-menu-right shadow pt-4 pb-4">
          {data.score <= 0 &&
            userRolePermission?.surveyCreate &&
            userRolePermission?.surveyManage && (
              <Link
                to={{
                  pathname: '/app/createsurvey',
                }}
                state={{ surveyData: { isQuestionBank: false, sData: data } }}
                className="dropdown-item"
              >
                {' '}
                Edit / Manage{' '}
              </Link>
            )}
          {data.acceptResponse &&
            userRolePermission?.surveyCreate &&
            userRolePermission?.surveyManage && (
              <Link
                to="#"
                onClick={republishSurveyHandler}
                className="dropdown-item"
              >
                {' '}
                Republish{' '}
              </Link>
            )}
          {/* <Link to="#" className="dropdown-item"> Mail </Link> */}
          {data.favorites && (
            <Link
              to="#"
              onClick={() => importantUnimportantHandler(false)}
              className="dropdown-item"
            >
              {' '}
              Mark as Unimportant{' '}
            </Link>
          )}
          {!data.favorites && (
            <Link
              to="#"
              onClick={() => importantUnimportantHandler(true)}
              className="dropdown-item"
            >
              {' '}
              Mark as Important{' '}
            </Link>
          )}
          {userRolePermission?.surveyManage && (
            <Link
              to="#"
              onClick={deleteSurveyHandler}
              className="dropdown-item"
            >
              {' '}
              Delete{' '}
            </Link>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};
export default SurveyResultCustomComponent;
