using Microsoft.AspNetCore.Mvc;

namespace Licenta.Controllers
{
    [ApiController]
    public class SimulationController : ControllerBase
    {
        [HttpPost("simulate")]
        public ActionResult<CircuitElement[][]> Simulate([FromBody] CircuitElement[][] mat)
        {
            var sim = new Simulator(mat);

            // Step 1: Compute
            sim.BeginNodeCompute(mat);

            // Step 2: Verify
            sim.VerifySourceLoop();

            // Step 3: Calculate Voltages
            sim.ModifiedNodalAnalysis();

            // Step 4: Calculate Intensities
            sim.KCL(mat);
            sim.CleanUp();

            // Step 5: Return simulation
            if (sim.INVALID_CIRCUIT)
                return BadRequest();
            else
                return Ok(mat);
        }
    }
}
