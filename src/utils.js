export function linearToDb(value)
{
    return 10.0 * Math.log2(value);
}

export function dbToLinear(value)
{
    return Math.pow(2, value / 10.0);
}