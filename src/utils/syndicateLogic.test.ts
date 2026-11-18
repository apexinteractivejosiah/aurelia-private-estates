import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_ESTATES,
  FINISH_UPGRADES,
  calculateConfiguredEstatePrice,
  calculateMortgageAndYield,
  filterEstates,
  generatePortfolioRefId,
  advanceEscrowStage,
  INITIAL_DOSSIERS,
} from './syndicateLogic';

test('all 4 estates have verified local /assets/ exterior and interior house photography paths', () => {
  assert.equal(INITIAL_ESTATES.length, 4);

  for (const estate of INITIAL_ESTATES) {
    assert.ok(estate.imageUrl.startsWith('/assets/'));
    assert.ok(estate.interiorImageUrl.startsWith('/assets/'));
    assert.equal(estate.imageUrl.includes('/public/'), false);
    assert.equal(estate.interiorImageUrl.includes('/public/'), false);
  }

  const villaSolana = INITIAL_ESTATES.find((e) => e.id === 'villa-solana');
  assert.ok(villaSolana);
  assert.equal(villaSolana.imageUrl, '/assets/estates/villa-solana-exterior.jpg');
  assert.equal(villaSolana.interiorImageUrl, '/assets/estates/villa-solana-interior.jpg');

  const glassPavilion = INITIAL_ESTATES.find((e) => e.id === 'glass-pavilion');
  assert.ok(glassPavilion);
  assert.equal(glassPavilion.imageUrl, '/assets/estates/glass-pavilion-exterior.jpg');
  assert.equal(glassPavilion.interiorImageUrl, '/assets/estates/glass-pavilion-interior.jpg');

  const aureliaPenthouse = INITIAL_ESTATES.find((e) => e.id === 'aurelia-penthouse');
  assert.ok(aureliaPenthouse);
  assert.equal(aureliaPenthouse.imageUrl, '/assets/estates/aurelia-penthouse-exterior.jpg');
  assert.equal(aureliaPenthouse.interiorImageUrl, '/assets/estates/aurelia-penthouse-interior.jpg');

  const meadowbrook = INITIAL_ESTATES.find((e) => e.id === 'meadowbrook-sanctuary');
  assert.ok(meadowbrook);
  assert.equal(meadowbrook.imageUrl, '/assets/estates/meadowbrook-exterior.jpg');
  assert.equal(meadowbrook.interiorImageUrl, '/assets/estates/meadowbrook-interior.jpg');
});

test('calculateConfiguredEstatePrice dynamically sums finish upgrades and lead time', () => {
  const result = calculateConfiguredEstatePrice(
    18500000,
    ['calacatta-viola', 'rooftop-spa-deck'],
    FINISH_UPGRADES
  );
  assert.equal(result.basePrice, 18500000);
  assert.equal(result.upgradesTotal, 420000 + 580000);
  assert.equal(result.totalAcquisitionPrice, 19500000);
  assert.equal(result.totalLeadTimeWeeks, 8);
});

test('calculateMortgageAndYield computes accurate down payment, loan, and 5-year appreciation', () => {
  const yieldData = calculateMortgageAndYield(20000000, 40, 5.0, 6.0, 120000);
  assert.equal(yieldData.downPaymentAmount, 8000000);
  assert.equal(yieldData.loanAmount, 12000000);
  assert.ok(yieldData.monthlyPrincipalAndInterest > 60000);
  assert.equal(yieldData.grossAnnualRentalIncome, 1440000);
  assert.ok(yieldData.projectedFiveYearValue > 26000000);
});

test('filterEstates filters accurately by location, price band, and availability', () => {
  const malibuOnly = filterEstates(INITIAL_ESTATES, 'Malibu', 'All', 'All');
  assert.equal(malibuOnly.length, 1);
  assert.equal(malibuOnly[0].id, 'villa-solana');

  const over22M = filterEstates(INITIAL_ESTATES, 'All', 'Over $22M', 'All');
  assert.equal(over22M.length, 1);
  assert.equal(over22M[0].id, 'glass-pavilion');

  const inEscrow = filterEstates(INITIAL_ESTATES, 'All', 'All', 'In Escrow');
  assert.equal(inEscrow.length, 1);
  assert.equal(inEscrow[0].id, 'aurelia-penthouse');
});

test('generatePortfolioRefId creates unique APE-XXXX reference IDs and advanceEscrowStage updates stage', () => {
  const newId = generatePortfolioRefId(['APE-7710', 'APE-6420'], 7741);
  assert.equal(newId, 'APE-7741');

  const collisionId = generatePortfolioRefId(['APE-7741'], 7741);
  assert.equal(collisionId, 'APE-7742');

  const updated = advanceEscrowStage(INITIAL_DOSSIERS[0], 5);
  assert.equal(updated.stage, 5);
});
