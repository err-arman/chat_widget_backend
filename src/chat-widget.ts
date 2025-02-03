(function () {
  const FRONTEND_URL = `http://localhost:3001`;
  const BACKEND_URL = `http://localhost:3000`;

  // Add Font Awesome CSS
  const fontAwesome = document.createElement('link');
  fontAwesome.rel = 'stylesheet';
  fontAwesome.href =
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
  document.head.appendChild(fontAwesome);

  // Create the chat widget container
  const chatWidget = document.createElement('div');
  chatWidget.id = 'chat-widget';
  chatWidget.style.position = 'fixed';
  chatWidget.style.bottom = '80px';
  chatWidget.style.right = '20px';
  chatWidget.style.width = '340px';
  chatWidget.style.height = '500px';
  chatWidget.style.background = 'white';
  chatWidget.style.border = '1px solid #ddd';
  chatWidget.style.borderRadius = '8px';
  chatWidget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
  chatWidget.style.overflow = 'hidden';
  chatWidget.style.display = 'none';
  chatWidget.style.zIndex = '9999';

  const header = document.createElement('div');
  header.style.width = '100%';
  header.style.height = '130px'; // Adjust height for better vertical alignment
  header.style.backgroundColor = '#8dbf43';
  header.style.borderBottom = '1px solid #ddd';
  header.style.display = 'flex';
  header.style.flexDirection = 'column'; // Stack logo and text vertically
  header.style.alignItems = 'center';
  header.style.justifyContent = 'center'; // Center content vertically
  header.style.padding = '0 15px';

  // Add logo to the header
  const logoContainer = document.createElement('div');
  logoContainer.style.height = '40px';
  logoContainer.style.width = '40px'; // Set width for consistency
  logoContainer.style.marginBottom = '5px'; // Add space between logo and text

  const imgElement = document.createElement('img');
  imgElement.src = `${BACKEND_URL}/buble/logo`; // Path to your PNG logo
  imgElement.alt = 'Logo'; // Provide descriptive alt text
  imgElement.style.height = '100%';
  imgElement.style.width = 'auto';
  imgElement.style.padding = '4px';
  imgElement.style.background = '#FFFFFF';
  imgElement.style.borderRadius = '10px'; // Optional: Add rounded corners to the logo

  logoContainer.appendChild(imgElement);

  // Add a title or header text (centered)
  const headerText = document.createElement('span');
  headerText.textContent = 'Crimson kotha'; // Set your desired header text
  headerText.style.color = 'white';
  headerText.style.fontSize = '16px';
  headerText.style.fontFamily = "'Lato', sans-serif"; // Set the font
  // headerText.style.fontWeight = 'bold';
  headerText.style.marginTop = '5px';

  // Append logo and text to the header
  header.appendChild(logoContainer);
  header.appendChild(headerText);

  // Create content wrapper for iframe
  const contentWrapper = document.createElement('div');
  contentWrapper.style.height = 'calc(100% - 130px)'; // Subtract header height

  // Create an iframe for your chat page
  const chatIframe = document.createElement('iframe');
  chatIframe.src = `${FRONTEND_URL}/chat`;
  chatIframe.style.width = '100%';
  chatIframe.style.height = '100%';
  chatIframe.style.border = 'none';

  // Assemble the widget
  contentWrapper.appendChild(chatIframe);
  chatWidget.appendChild(header);
  chatWidget.appendChild(contentWrapper);
  document.body.appendChild(chatWidget);

  // Create a floating button with Font Awesome icon
  const chatButton = document.createElement('button');
  chatButton.innerHTML = '<i class="far fa-comment"></i>';
  chatButton.style.position = 'fixed';
  chatButton.style.bottom = '20px';
  chatButton.style.right = '20px';
  chatButton.style.width = '50px';
  chatButton.style.height = '50px';
  chatButton.style.borderRadius = '50%';
  chatButton.style.border = 'none';
  chatButton.style.backgroundColor = '#8dbf43';
  chatButton.style.color = 'white';
  chatButton.style.fontSize = '20px';
  chatButton.style.cursor = 'pointer';
  chatButton.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
  chatButton.style.zIndex = '10000';
  chatButton.style.transition = 'transform 0.3s ease';

  // Define icons using Font Awesome classes
  const messageIcon = '<i class="fas fa-comment"></i>';
  const closeIcon = '<i class="fas fa-times"></i>';

  // Toggle the chat widget and icon when the button is clicked
  chatButton.addEventListener('click', () => {
    if (chatWidget.style.display === 'none') {
      chatWidget.style.display = 'block';
      chatButton.innerHTML = closeIcon;
      chatButton.style.transform = 'rotate(180deg)';
    } else {
      chatWidget.style.display = 'none';
      chatButton.innerHTML = messageIcon;
      chatButton.style.transform = 'rotate(0deg)';
    }
  });

  document.body.appendChild(chatButton);
})();
