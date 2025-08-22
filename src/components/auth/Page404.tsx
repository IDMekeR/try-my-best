import { Result } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const Page404: React.FC = () =>{
    return(
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Link to="/login" type="primary">Back to Login</Link>}
        />
    )
}

export default Page404;