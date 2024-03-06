import React ,{useEffect, useState} from 'react'
import { useNavigate} from 'react-router-dom';
import axios from 'axios';

axios.defaults.withCredentials = true;


function Login() {
  // const inputs = document.querySelectorAll(".form-control");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loginFailed, setLoginFailed] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        console.log('Checking login status...');
        const response = await axios.get('http://127.0.0.1:5000/api/user/current', {
          withCredentials: true,
        });
      
        if (!response.data.isLoggedIn) {
          setIsLoggedIn(true);
          navigate('/chatpage');
        }
      }catch(Error) {
        console.error('Error checking login status:', Error);
      }
    };
    checkLoginStatus();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.trim() === '' || password.trim() === '') {
      setErrorText('Please enter both email/phone and password.');
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/user/login', {
        email,
        password,
      });
      console.log(response.data);
      console.log('Login Success');
      setIsLoggedIn(true);
      navigate(`/chatpage`);
    }catch(Error){
      console.error('Login failed in client:', Error);
      setErrorText('Incorrect email/phone or password. Please try again.');
      setLoginFailed(true);
    }
  };
  if(isLoggedIn){
    return null; 
  }



  return (
		 <div className="login-content">
			 <form onSubmit={handleSubmit}>
         <h1>Chat Application</h1>
					 <div className="div">
						 <input type="text" id="form-control" name='email' value={email}   onChange={(e) => setEmail(e.target.value)} placeholder='Email Address' pattern='[a-zA-z 0-9#$&]+@[a-zA-Z]+.[a-zA-z]{3}' title='invalid email' required  />
					 </div>
					<div className="div">
						<input type="password" className="form-control" name='Password' value={password}   onChange={(e) => setPassword(e.target.value)}  placeholder='Password'  title='invalid Password' required />
					</div>
				  <button className="btn"> LOGIN </button>
			 </form>
   {loginFailed && (
        <div className="model">
          <div className="model-content">
            <h2>Login Failed</h2>
            <p>{errorText}</p>
            <button className="button-16" onClick={() => setLoginFailed(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login

