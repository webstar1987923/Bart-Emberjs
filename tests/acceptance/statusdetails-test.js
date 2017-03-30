import { test } from 'qunit';
import moduleForAcceptance from 'bart/tests/helpers/module-for-acceptance';

import Pretender from 'pretender';

let server;

moduleForAcceptance('Acceptance | statusdetails', {
  beforeEach() {
    server = new Pretender();
  },
  afterEach() {
    server.shutdown();
  }
});

test('waiting for a populating tickets', function(assert) {

  const PAYLOAD = {
    "data": {
        "jira": [
            {
                "reporter": "Gary Allen()",
                "issue": {
                    "summary": "bojira desc",
                    "project": {
                        "name": "API Catalog",
                        "id": "10101",
                        "key": "APICAT"
                    },
                    "status": {
                        "name": "To Do"
                    },
                    "assignee": null,
                    "environment": "Unknown",
                    "created": "2016-11-18T17:55:50.820+0000",
                    "description": null,
                    "customfield_10103": "Gary Allen",
                    "customfield_10101": null,
                    "issuetype": {
                        "id": "10006",
                        "name": "Bug",
                        "description": "A problem which impairs or prevents the functions of the product."
                    }
                },
                "ticketNum": "APICAT-11",
                "activeOrg": null,
                "time": "11/18/2016 12:55:50 PM"
            },
            {
                "reporter": "Gary Allen()",
                "issue": {
                    "summary": "bojira desc",
                    "project": {
                        "name": "API Catalog",
                        "id": "10101",
                        "key": "APICAT"
                    },
                    "status": {
                        "name": "To Do"
                    },
                    "assignee": null,
                    "environment": "Unknown",
                    "created": "2016-11-18T17:55:50.820+0000",
                    "description": null,
                    "customfield_10103": "Gary Allen",
                    "customfield_10101": null,
                    "issuetype": {
                        "id": "10006",
                        "name": "Bug",
                        "description": "A problem which impairs or prevents the functions of the product."
                    }
                },
                "ticketNum": "APICAT-10",
                "activeOrg": null,
                "time": "11/18/2016 12:55:50 PM"
            }
        ]
    }
};

	visit('/statusdetails');

  server.get('/bart/api/tickets/get?sorting=MyTickets&attuid=ga4892', function(){
    return [ 200, PAYLOAD];
  });
 
  andThen(function() {
  	assert.equal(currentURL(), '/statusdetails');
    assert.ok($('#tickets .ticket').length > 0, 'Tickets loaded sucessfully');
  });

  click('#requestNumber');

  andThen(function(){
    assert.equal($('tr.ticket:eq(0) .request-number a').text(), 'APICAT-10');
    assert.equal($('tr.ticket:eq(1) .request-number a').text(), 'APICAT-11');
  });
});
