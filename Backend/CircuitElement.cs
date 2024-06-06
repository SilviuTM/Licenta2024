namespace Licenta
{
    public class CircuitElement
    {
        public char Letter {get;set;}
        public bool Active { get; set; }
        // not implemented yet
        public int Intensity { get; set; }
        public int Amplitude { get; set; }
        // intre 0 si 360
        public int Rotation { get; set; } 
        public bool IsTurnedOn { get; set; }
    }
}
