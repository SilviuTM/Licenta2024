using Licenta.Models;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Licenta.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SimulationController : ControllerBase
    {
        [HttpPost("simulate")]
        public CircuitElement[][] Simulate([FromBody] CircuitElement[][] mat)
        {
            Simulator.ResetCircuit(mat);
            Simulator.Simulate(mat);

            return mat;
        }

    }
}
