module.exports = class WebUi {
  constructor(matchs, makeMatch) {
    this.matchs = matchs
    this.makeMatch = makeMatch
    this.express = require('express')
    this.prettify = require('express-prettify');
    this.template = ({ id, matchName, players, beatmap, previousBeatmap, host, startTime, autoBeat }) => (`
      <div class="webUi">
      <table style="width:80%; text-align:center; margin: 5% auto">
        <tr style="border-bottom:1px solid">
          <th>Room</th>
          <th>Id</th>
          <th>Host</th>
          <th>Beatmap</th>
          <th>Auto Beat</th>
          <th>Start time</th>
          <th>Players</th>
        </tr>
        <tr>
          <td>${matchName}</td>
          <td>${id}</td>
          <td>${host}</td>
          <td><a href="/nowPlaying?matchId=${id}&pretty">${beatmap}</a></td>
          <td><a href="/autobeat?matchId=${id}">${autoBeat}</a></td>
          <td>${new Date(startTime).toISOString()}</td>
          <td><ul>${players.map(player => (`
          <li>
            ${player}
            <a href="/kick?matchId=${id}&player=${player}">Kick</a>
            <a href="/host?matchId=${id}&player=${player}">Host</a>
          <li>
        `))}</ul></td>
        </tr>
        <tr>
          <td><a href="/start?matchId=${id}">GO</a></td>
        </tr>
      </table>
    </div>
      `)
    this.app = this.express();
    // this.app.set('matchList', this.matchs)
    this.app.use(this.prettify({ query: 'pretty' }))
      .get('/', (_req, res) => res.end(this.matchs.map(match => this.template(match)).join('<br/>')))
      .get('/nowPlaying', (req, res) => {
        const { matchId } = req.query;
        const beatmap = this.matchs.map(match => match.id === matchId ? match.fullBeatmapData : null)
        res.json(beatmap)
      })
      .get('/start', (req, res) => {
        const { matchId } = req.query;
        this.matchs.map(match => matchId === match.id ? match.start() : null)
        res.redirect('back')
      })
      .get('/kick', (req, res) => {
        const { matchId, player } = req.query;
        this.matchs.map(match => matchId === match.id ? match.kick(player) : null)
        res.redirect('back')
      })
      .get('/host', (req, res) => {
        const { matchId, player } = req.query;
        this.matchs.map(match => matchId === match.id ? match.makeHost(player) : null)
        res.redirect('back')
      })
      .get('/autobeat', (req, res) => {
        const { matchId } = req.query;
        this.matchs.map(match => matchId === match.id ? match.autoBeat = !match.autoBeat : null)
        res.redirect('back')
      })
      .get('/newMatch', (req, res) => { // not in use
        const { matchName, password } = req.query;
        // const { matchId } = req.query;
        // this.matchs.map(match => matchId === match.id ? match.autoBeat = !match.autoBeat : null)
        res.redirect('back')
      })
      .listen(4000, console.log(`Web UI listening on http://localhost:4000`));
  }
}