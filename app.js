// Init Copernica
const copernica = new Copernica;
// Init UI
const ui = new UI;

// Get input values
const accessTokenInput = document.getElementById('accessToken');
const documentNumberInput = document.getElementById('documentNumber');

// Listen to button click
document.getElementById('button').addEventListener('click', docNumber);

// Get email document id
function docNumber() {
  // Show loader
  document.getElementById('loading').style.display = 'inline-block';
  
  // Get input text
  const documentNumber = documentNumberInput.value;
  const accessToken = accessTokenInput.value;

  if(documentNumber !== '' && accessToken !== ''){
    // Make http call
    copernica.getDocumentResults(documentNumber, accessToken)
      .then(data => {

          let output = '', deliveryEvents = 0, retryEvents = 0, failureEvents = 0, attemptEvents = 0, clickEvents = 0, openEvents = 0, unknownEvents = 0; totalEvents = 0; abuseEvents = 0; unsubscribeEvents = 0;

          // Count and add event counts
          data.document.forEach(function(data){
            switch(data.event){
              case 'delivery':
              deliveryEvents += 1;
              break;
              case 'abuse':
              abuseEvents += 1;
              break;
              case 'unsubscribe':
              unsubscribeEvents += 1;
              break;
              case 'retry':
              retryEvents += 1;
              break;
              case 'failure':
              failureEvents += 1;
              break;
              case 'attempt':
              attemptEvents += 1;
              break;
              case 'click':
              clickEvents += 1;
              break;
              case 'open':
              openEvents += 1;
              break;
              default:
              unknownEvents += 1;
              break;
            }

            if(data.id !== '') {
              totalEvents += 1;
            }
          });


          // Event weight selector
          const selectEvent = (currentEvent, newEvent) => {
            const eventWeights = { abuse: 1, unsubscribe: 2, click: 3, open: 4, delivery: 5, attempt: 6, retry: 7, failure: 8 };
            const currentWeight = eventWeights[currentEvent];
            const newWeight = eventWeights[newEvent];
            if (currentWeight > newWeight) {
              return newEvent;
            }
            return currentEvent;
          };


          // Count unique events
          const reduce = (accumulator, currentValue) => {
            const found = accumulator.find(e => e.id === currentValue.id);
            if (!found) {
              accumulator.push(currentValue);
            } else {
              found.event = selectEvent(found.event, currentValue.event);
            }
            return accumulator;
          };

          const uniqueIds = data.document.reduce(reduce, []);
          

          // Final calculations
          function percentage(partialValue, totalValue) {
            return (100 * partialValue) / totalValue;
          }
          const destinations = uniqueIds.length;
          const delivered = destinations - failureEvents;
          const deliverability = percentage(delivered, destinations).toFixed(2);
          const spam = uniqueIds.filter(e => e.event === 'abuse').length;
          const unsubscribe = uniqueIds.filter(e => e.event === 'unsubscribe').length;
          const impressions = uniqueIds.filter(e => e.event === 'open').length;
          const clicks = uniqueIds.filter(e => e.event === 'click').length;
          const opens = clicks + impressions;
          // const noresponse = uniqueIds.filter(e => e.event === 'delivery').length; // Incorrect endTotal
          const noresponse = delivered - opens - spam - unsubscribe;
          const or = percentage(opens, delivered).toFixed(2);
          const ctr = percentage(clicks, delivered).toFixed(2);
          const cor = percentage(clicks, opens).toFixed(2);
          

          // Insert into HTML
          document.getElementById('resultDocument').innerHTML = documentNumber; // DONE
          document.getElementById('resultDestinations').innerHTML = destinations; // DONE
          document.getElementById('resultErrors').innerHTML = failureEvents; // DONE (All failureEvents, no uniqueIds)
          document.getElementById('resultDelivered').innerHTML = delivered; // DONE
          document.getElementById('resultDeliverability').innerHTML = deliverability + '%'; // DONE
          document.getElementById('resultNoResponse').innerHTML = noresponse; // DONE
          document.getElementById('resultImpressions').innerHTML = impressions; // DONE
          document.getElementById('resultClicks').innerHTML = clicks; // DONE
          document.getElementById('resultOpens').innerHTML = opens; // DONE
          document.getElementById('resultOR').innerHTML = or + '%'; // DONE
          document.getElementById('resultCTR').innerHTML = ctr + '%'; // DONE
          document.getElementById('resultCOR').innerHTML = cor + '%'; // DONE
          document.getElementById('resultSpam').innerHTML = spam; // DONE
          document.getElementById('resultUnsubscribe').innerHTML = unsubscribe; // DONE

          // Output raw event data
          output += `<p><small><strong><em>Raw data:</strong><br>
          Total events: ${totalEvents}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          Unique events: ${destinations}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          Attempt events: ${attemptEvents}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          Failure events: ${failureEvents}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          Retry events: ${retryEvents}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          Delivery events: ${deliveryEvents}<br>
          Open events: ${openEvents}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          Click events: ${clickEvents}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          Unsubscribe events: ${unsubscribeEvents}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          Abuse events: ${abuseEvents}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          Unknown events: ${unknownEvents}
          </em></small></p>
          `;
          document.getElementById('output').innerHTML = output;

          // Hide loader
          document.getElementById('loading').style.display = 'none';

          // Enable button again
          document.getElementById("button").disabled = false;

      })
  } else {
    // Hide loader
    document.getElementById('loading').style.display = 'none';
    
    if(accessToken === ''){
    // Show alert for no access token inserted
    ui.showAlert('Error: No access token inserted', 'alert alert-danger');
    } else if(documentNumber === ''){ 
    // Show alert for no document number inserted
    ui.showAlert('Error: No document number inserted', 'alert alert-danger');
    } else {
    // Show generic error alert
    ui.showAlert('Error: Something went wrong', 'alert alert-danger');
    }
  }

}