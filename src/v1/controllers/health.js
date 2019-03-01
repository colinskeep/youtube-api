
/**
 * Health Check
 * @param {string} req - The incoming request.
 * @param {string} res - The outcoming response.
 */
function getCheck(req, res) {
  res.status(200).send('OK');
}

module.exports = {getCheck};
