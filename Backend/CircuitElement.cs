namespace Licenta
{
    public class CircuitElement
    {
        public char Letter {get;set;}

        public double Voltage { get; set; }

        public double Amplitude { get; set; }

        public double Resistance { get; set; }

        public int Rotation { get; set; } 

        public bool IsTurnedOn { get; set; }

        public List<char> currentFrom { get; set; } = [];

        public List<char> currentTo { get; set; } = [];
    }
}
