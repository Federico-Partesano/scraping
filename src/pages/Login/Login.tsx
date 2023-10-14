import React, { FC } from "react";
import "./Login.scss";
import { useDispatch } from "react-redux";
import { setSessionId } from "../../redux/reducers/configuration";

interface ILogin {}

const Login: FC<ILogin> = () => {
  const dispatch = useDispatch();

  const porcaMadonna = async () => {
    const id = "1eofq34ndnetasheuiej6hp492";
    try {
      await fetch(
        "https://www.iqmselezione.it/admin/home.php",
        {
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua":
              '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "frame",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            cookie: `_ga=GA1.1.969013372.1680772973; _fbp=fb.1.1680772973189.962531141; roundcube_cookies=enabled; __utmz=221577344.1689582796.1.1.utmccn=(direct)|utmcsr=(direct)|utmcmd=(none); __utma=221577344.1958274846.1689582796.1689586163.1689590704.4; _gcl_au=1.1.1700558223.1689769890; ln_or=eyIxODk4MTQ1IjoiZCJ9; _ga_KL0X5YGJ8M=GS1.1.1697277577.15.0.1697277584.0.0.0; PHPSESSID=${id}`,
            Referer: "https://www.iqmselezione.it/admin/home.php",
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
          body: "u=IQMUSER&p=%21IQMsettembre%2123&Submit=LOGIN",
          method: "POST",
        }
      );
      dispatch(setSessionId(id));
    } catch (error) {
      console.error("erroreeeeeeeeeeeeeeeeeeeee", error);
    }
  };

  return (
    <div>
      <button onClick={porcaMadonna}>Lgoin</button>
    </div>
  );
};

export default Login;