import '../style.css'

interface MyData {
  [key: string]: Record<string, Record<any, any>>;
}

const myObject: MyData = {};

const newd: HTMLDivElement | null = document.getElementById('app') as HTMLDivElement;

if (newd) {
  const newpara: HTMLHeadingElement = document.createElement('h2');
  newpara.classList.add('change')
  const myForm: HTMLFormElement = document.createElement('form');
  newd.appendChild(myForm);
  newd.appendChild(newpara)

  const myInput: HTMLInputElement = document.createElement('input');
  myInput.type = 'text';
  myForm.appendChild(myInput);

  const myButton: HTMLButtonElement = document.createElement('button');
  myButton.type = 'submit';
  myButton.textContent = 'Submit';
  myButton.addEventListener('click', async (event: MouseEvent) => {
    event.preventDefault();
    const myInput: HTMLInputElement = myForm.querySelector('input[type="text"]') as HTMLInputElement;
    const inputValue: string = myInput.value;
    const data: Record<string, any> | string = await getWeather(`https://wttr.in/${inputValue}?format=j1`);
    //const data = await response.json();
    if (typeof data === 'object') {
      myObject[data['nearest_area'][0]['region'][0]['value']] = data

      const paragraphElement: HTMLHeadingElement | null = document.querySelector('.change');
      if (paragraphElement) {
        if (!paragraphElement.textContent?.includes(data['nearest_area'][0]['region'][0]['value'])) {
          paragraphElement.textContent += data['nearest_area'][0]['region'][0]['value'] + ' '
        } else {
          myInput.value = 'Duplicate'
        }
      }
    }
    const ulc: HTMLUListElement | null = document.getElementById('searches') as HTMLUListElement;
    Object.values(myObject).forEach((item: Record<any, any>) => {
      let newli = document.createElement('li')
      newli.innerHTML = `<a><u>${item['nearest_area'][0]['region'][0]['value']}</u></a> Feels like: ${
        item['current_condition'][0]['FeelsLikeF']
      }`
      ulc?.appendChild(newli);
    })
    //remove duplicate list items
    const listItems: HTMLCollectionOf<HTMLLIElement> = document.getElementsByTagName("li");
    var uniqueItemsArray: any[] = [];
  
    Array.from(listItems).forEach(function(item: HTMLLIElement) {
      if(uniqueItemsArray.indexOf(item.innerHTML) === -1) {
        uniqueItemsArray.push(item.innerHTML);
      } else {
        ulc.removeChild(item);
      }
    });
    setTimeout(() => {myInput.value = ''}, 500)
  });
  myForm.appendChild(myButton);
}

async function getWeather(url: string): Promise<any> {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    return `Error fetching data: `;
  }
}
