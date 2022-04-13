<html>
    <head>
        <style type="text/css">
            @media screen {
                @font-face {
                    font-family: 'Poppins';
                    font-style: normal;
                    font-weight: 400;
                    src: local('Poppins Regular'), local('Poppins-Regular'), url(https://fonts.googleapis.com/css?family=Poppins') format('woff');
                }
                body {
                    font-family: 'Poppins', sans-serif;
                    margin: 0px;
                    background:#eef2f3;
                }
            </style>
        </head>
        <body style='padding: 30px;'>	
            <p style='color: #000;
               margin-block-end: 15px;
               line-height:2'><b>Hello {{$mail_data['name']}}</b> Forgot Your Password?</p>
            <p style='color: #000;
               margin-block-start: 12px;
               margin-block-end: 12px;'>Click on the button below to reset the password</p>
            <p style='color: #000;
               margin-block-start: 30px;
               margin-block-end: 12px;'>	<span style='font-size: 30px;
                     color: #000;'><a href="{{$mail_data['link']}}" style="	font-size: 12px;
                     text-decoration: none;
                     font-weight: 600;
                     color: #fff;
                     background: #09b82d;
                     padding: 13px 21px;
                     display: inline-block;
                     border-radius: 6px;
                     ">Reset Password</a></span> <br></p>
        </body>
    </html>
