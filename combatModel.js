export class CombatModel {
  constructor(layer) {
    this.layer = layer;
    this.previousState = new Map();
  }

  async update(timeExtent) {
    //console.log("=== UPDATE ===");

    const start = timeExtent?.start;
    const end = timeExtent?.end || start;

    if (!start) return;

    //console.log("Offset (min):", start.getTimezoneOffset());
    //const offsetMs = -start.getTimezoneOffset() * 60 * 1000;
    const startMs = start.getTime(); // + offsetMs;
    const endMs = end.getTime(); // + offsetMs;

    // nur die aktuellen Features laden    
    const whereClause = `
      dtg >= DATE '${this.formatDate(start)}'
      AND dtg <= DATE '${this.formatDate(end)}'
    `;
    //console.log(whereClause);
    const result = await this.layer.queryFeatures({
        where: whereClause,
        outFields: ["unit_id", "dtg", "lat", "lon", "hp", "target_id", "unit", "country", "is_alive"],
        returnGeometry: false
    });

    const currentState = new Map();

    result.features.forEach(f => {
        currentState.set(f.attributes.unit_id, f.attributes);
    });

    //console.log("Current units:", currentState.size);

    const events = this.detectCombatEvents(this.previousState, currentState);

    //console.log("Events:", events);

    this.previousState = currentState;
    return events;
  }
  
  formatDate(date) {
    const pad = (v) => String(v).padStart(2, "0");

    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const hour = pad(date.getUTCHours());
    const min = pad(date.getUTCMinutes());
    const sec = pad(date.getUTCSeconds());

    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
  }

  detectCombatEvents(prev, curr) {
    const events = [];

    curr.forEach((unit, id) => {

      // skip first frame (no previous state)
      if (!prev.has(id)) return;

      const prevUnit = prev.get(id);

      /*
      console.log(
        "CHECK UNIT:",
        id,
        "prev alive:", prevUnit.is_alive,
        "curr alive:", unit.is_alive
      );
      */

      // KILL detected (alive → dead)
      if (prevUnit.is_alive === 1 && unit.is_alive === 0) {

        //console.log("💀 KILL DETECTED:", unit.unit);

        // finde Angreifer im vorherigen Zustand
        //const attackers = [];
        let attackerCount = 0;

        prev.forEach(other => {
          if (other.target_id === id) {
            //attackers.push(other);
            attackerCount++;
          }
        });

        // prüfe neue Ziele
        /*
        const attackersWithNewTargets = attackers.map(att => {
          const now = curr.get(att.unit_id);

          return {
            unit_id: att.unit_id,
            unit: att.unit,
            old_target: att.target_id,
            new_target: now?.target_id
          };
        });
        */
        
        events.push({
          type: "kill",
          target: unit,
          //attackers: attackersWithNewTargets
          attackerCount
        });
      }
    });

    return events;
  }

  reset() {
    this.previousState = new Map();
  }
}
