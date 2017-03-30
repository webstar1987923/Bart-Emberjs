import { test } from 'qunit';
import moduleForAcceptance from 'bart/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | check status of single issue');

test('visiting home', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/home');
  });
});
