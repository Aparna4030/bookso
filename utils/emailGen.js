const genEmailHtml = (otp)=>{
    const html =
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Email</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Roboto', sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
            }
    
            .container {
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
    
            .otp {
                font-size: 24px;
                font-weight: bold;
                color: #333333;
                margin-bottom: 20px;
            }
    
            .note {
                font-size: 16px;
                color: #555555;
                margin-bottom: 20px;
            }
    
            .footer {
                font-size: 14px;
                color: #888888;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <p class="otp">Your One-Time Password (OTP): <br><span style="color: #3498db;">${otp}</span></p>
            <p class="note">This OTP is valid for a short period. Please use it to complete your action.</p>
            <p class="footer">Sent with ❤️ from Bookso</p>
        </div>
    </body>
    </html>
    `

    return html;
}

module.exports = genEmailHtml;