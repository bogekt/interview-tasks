using System;
using System.Threading;

namespace ChatApi.Extensions
{
    /// <summary>
    /// Utils for instantiating singleton objects 
    /// </summary>
    public static class SingletonExtensions
    {
        /// <summary>
        /// Try to create not instantiated (not-null) object
        /// with provided <paramref name="factory"/> method.
        /// If the <paramref name="singleton"/> is already instantiated,
        /// then it immediately would be returned.
        /// This method is thread-safe and use the famous DCL technique.
        /// Details: https://en.wikipedia.org/wiki/Double-checked_locking.
        /// </summary>
        /// <typeparam name="T">The type of singleton</typeparam>
        /// <param name="singleton">The ref to singleton, which would be instantiated</param>
        /// <param name="locker">The locker argument, which block multiple instantiation using <seeaslo cref="Monitor.Enter(object)"/></param>
        /// <param name="factory">The factory, which using for singleton instantiation</param>
        /// <returns>Already or just instantiated singleton</returns>
        public static T TryCreateSingleton<T>(
            ref T singleton, 
            object locker, 
            Func<T> factory
        ) 
            where T: class
        {
            // First check
            if (singleton != null)
            {
                return singleton;
            }

            // To avoid try/finally in lock statement
            Monitor.Enter(locker);

            // Second check
            if (singleton == null)
            {
                singleton = factory();
            }

            Monitor.Exit(locker);

            return singleton;
        }
    }
}
