import cheerio from "cheerio";

const f = (htmlString: string, headers?: string[]) => {
  const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/g;

  const tdMatches = htmlString.match(tdRegex);

  if (!tdMatches) return null;
  const t = tdMatches!
    .map((match) => {
      let content = match
        .replace(/<\/?td[^>]*>/g, "")
        .replace(/<\/?strong[^>]*>/g, "")
        .replace(/<\/?span[^>]*>/g, "")
        .replace(/<\/?a[^>]*>/g, "")
        .replace(/<\/?b[^>]*>/g, "")
        .replace(/<\/?font[^>]*>/g, "")
        .replace(/\n/g, "");
      return content;
    })
    .splice(0, 10); // Ritorna solo i primi 10 risultati
  if (!headers) return t;
  let output: any = {};
  headers.forEach((header, index) => {
    output[header] = t![index];
  });

  return output;
};

export const getUsers = async (page: number) => {
  const response = await fetch(
    `https://www.iqmselezione.it/admin/amministra.php?link=2&&page=${page}`,
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",

        "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",

        "sec-ch-ua":
          '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',

        "sec-ch-ua-mobile": "?0",

        "sec-ch-ua-platform": '"Windows"',

        "sec-fetch-dest": "frame",

        "sec-fetch-mode": "navigate",

        "sec-fetch-site": "same-origin",

        "sec-fetch-user": "?1",

        "upgrade-insecure-requests": "1",

        cookie:
          "_ga=GA1.1.969013372.1680772973; _fbp=fb.1.1680772973189.962531141; roundcube_cookies=enabled; __utmz=221577344.1689582796.1.1.utmccn=(direct)|utmcsr=(direct)|utmcmd=(none); __utma=221577344.1958274846.1689582796.1689586163.1689590704.4; _gcl_au=1.1.1700558223.1689769890; _ga_KL0X5YGJ8M=GS1.1.1695376633.13.0.1695376635.0.0.0; PHPSESSID=i3o5ubhbi0npcmcsrv4ibo7qd4",

        Referer: "https://www.iqmselezione.it/admin/amministra.php?link=2",

        "Referrer-Policy": "strict-origin-when-cross-origin",
      },

      body: null as any,

      method: "GET",
    }
  );
  const $ = cheerio.load(await response.text());

  const html = $.html();
  const ultimoTbody = $("tbody").last();

  const t = ultimoTbody.html() as string;

  const tt = t.split("</tr>");
  const headers = f(tt[0]!);

  // const datiFile = fs.readFileSync(path2, "utf-8");
  // const oggettoJson = JSON.parse(datiFile);
  // fs.writeFileSync(path, t);
  return tt.map((item) => f(item, headers));
};
