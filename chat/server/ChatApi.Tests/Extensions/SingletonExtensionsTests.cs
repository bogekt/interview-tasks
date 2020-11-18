using System.Collections.Concurrent;
using System.Linq;
using System.Threading;
using NUnit.Framework;
using ChatApi.Extensions;

namespace ChatApi.Tests.Extensions
{
    [TestFixture]
    public class SingletonExtensionsTests
    {
        class TestClass
        {
            public int id { get; set; }
        }

        [Test]
        public void TryCreateSingleton_NullSingletonAndFactoryForIt_SingleTimeCalledFactoryAndSingletonFrimIt()
        {
            int n = 1000;
            TestClass singleton = null;
            var threads = new Thread[n];
            var locker = new object();
            var ids = new ConcurrentBag<int>();
            int counter = 0;

            for (var i = 0; i < threads.Length; i++)
                threads[i] =new Thread(
                    () =>
                    {
                        ids.Add(Thread.CurrentThread.ManagedThreadId);
                        SingletonExtensions.TryCreateSingleton(
                            ref singleton,
                            locker,
                            () =>
                            {
                                counter++;

                                return new TestClass() { id = Thread.CurrentThread.ManagedThreadId };
                            }
                        );
                    });

            foreach (Thread thread in threads)
            {
                thread.Start();
            }

            foreach (Thread thread in threads)
            {
                thread.Join();
            }

            Assert.GreaterOrEqual(ids.Distinct().Count(), n);
            Assert.IsNotNull(singleton);
            Assert.AreEqual(1, counter);
        }
    }
}
