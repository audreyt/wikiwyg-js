# File::MMagic
#
# $Id: MMagic.pm 259 2006-05-23 05:55:32Z knok $
#
# This program is originated from file.kulp that is a production of The
# Unix Reconstruction Projct.
#    <http://language.perl.com/ppt/index.html>
# Copyright 1999,2000,2001,2002 NOKUBI Takatsugu <knok@daionet.gr.jp>.
#
# This product includes software developed by the Apache Group
# for use in the Apache HTTP server project (http://www.apache.org/).
#
# License for the program is followed the original software. The license is
# below.
#
# This program is copyright by dkulp 1999.
#
# This program is free and open software. You may use, copy, modify, distribute
# and sell this program (and any modified variants) in any way you wish,
# provided you do not restrict others to do the same, except for the following
# consideration.
#
#I read some of Ian F. Darwin's BSD C implementation, to
#try to determine how some of this was done since the specification
#is a little vague.  I don't believe that this perl version could
#be construed as an "altered version", but I did grab the tokens for
#identifying the hard-coded file types in names.h and copied some of
#the man page.
#
#Here's his notice:
#
#  * Copyright (c) Ian F. Darwin, 1987.
#  * Written by Ian F. Darwin.
#  *
#  * This software is not subject to any license of the American Telephone
#  * and Telegraph Company or of the Regents of the University of California.
#  *
#  * Permission is granted to anyone to use this software for any purpose on
#  * any computer system, and to alter it and redistribute it freely, subject
#  * to the following restrictions:
#  *
#  * 1. The author is not responsible for the consequences of use of this
#  *    software, no matter how awful, even if they arise from flaws in it.
#  *
#  * 2. The origin of this software must not be misrepresented, either by
#  *    explicit claim or by omission.  Since few users ever read sources,
#  *    credits must appear in the documentation.
#  *
#  * 3. Altered versions must be plainly marked as such, and must not be
#  *    misrepresented as being the original software.  Since few users
#  *    ever read sources, credits must appear in the documentation.
#  *
#  * 4. This notice may not be removed or altered.
#
# The following is the Apache License. This program contains the magic file
# that derived from the Apache HTTP Server.
#
#  * Copyright (c) 1995-1999 The Apache Group.  All rights reserved.
#  *
#  * Redistribution and use in source and binary forms, with or without
#  * modification, are permitted provided that the following conditions
#  * are met:
#  *
#  * 1. Redistributions of source code must retain the above copyright
#  *    notice, this list of conditions and the following disclaimer.
#  *
#  * 2. Redistributions in binary form must reproduce the above copyright
#  *    notice, this list of conditions and the following disclaimer in
#  *    the documentation and/or other materials provided with the
#  *    distribution.
#  *
#  * 3. All advertising materials mentioning features or use of this
#  *    software must display the following acknowledgment:
#  *    "This product includes software developed by the Apache Group
#  *    for use in the Apache HTTP server project (http://www.apache.org/)."
#  *
#  * 4. The names "Apache Server" and "Apache Group" must not be used to
#  *    endorse or promote products derived from this software without
#  *    prior written permission. For written permission, please contact
#  *    apache@apache.org.
#  *
#  * 5. Products derived from this software may not be called "Apache"
#  *    nor may "Apache" appear in their names without prior written
#  *    permission of the Apache Group.
#  *
#  * 6. Redistributions of any form whatsoever must retain the following
#  *    acknowledgment:
#  *    "This product includes software developed by the Apache Group
#  *    for use in the Apache HTTP server project (http://www.apache.org/)."
#  *
#  * THIS SOFTWARE IS PROVIDED BY THE APACHE GROUP ``AS IS'' AND ANY
#  * EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
#  * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
#  * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE APACHE GROUP OR
#  * ITS CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
#  * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
#  * NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
#  * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
#  * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
#  * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
#  * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
#  * OF THE POSSIBILITY OF SUCH DAMAGE.

package File::MMagic;

=head1 NAME

File::MMagic - Guess file type

=head1 SYNOPSIS

  use File::MMagic;
  use FileHandle;

  $mm = new File::MMagic; # use internal magic file
  # $mm = File::MMagic->new('/etc/magic'); # use external magic file
  # $mm = File::MMagic->new('/usr/share/etc/magic'); # if you use Debian
  $res = $mm->checktype_filename("/somewhere/unknown/file");

  $fh = new FileHandle "< /somewhere/unknown/file2";
  $res = $mm->checktype_filehandle($fh);

  $fh->read($data, 0x8564);
  $res = $mm->checktype_contents($data);

=head1 ABSTRACT

This perl library uses perl5 objects to guess file type from filename
and/or filehandle.

=head1 DESCRIPTION

checktype_filename(), checktype_filehandle() and checktype_contents
returns string contains file type with MIME mediatype format.

=head1 METHODS

=over 4

=item File::MMagic->new()

=item File::MMagic->new( $filename )

Initializes the module. If no filename is given, the magic numbers
stored in File::MMagic are used.

=item $mm->addSpecials

If a filetype cannot be determined by magic numbers, extra checks are
done based on extra regular expressions which can be defined here. The
first argument should be the filetype, the remaining arguments should
be one or more regular expressions.

By default, checks are done for message/news, message/rfc822,
text/html, text/x-roff.

=item $mm->removeSpecials

Removes special regular expressions. Specify one or more filetypes. If
no filetypes are specified, all special regexps are removed.

Returns a hash containing the removed entries.

=item $mm->addFileExts

If a filetype cannot be determined by magic numbers, extra checks can
be done based on the file extension (actually, a regexp). Two
arguments should be geiven: the filename pattern and the corresponding
filetype.

By default, checks are done for application/x-compress,
application/x-bzip2, application/x-gzip, text/html, text/plain

=item $mm->removeFileExts

Remove filename pattern checks. Specify one or more patterns. If no
pattern is specified, all are removed.

Returns a hash containing the removed entries.

=item $mm->addMagicEntry

Add a new magic entry in the object. The format is same as magic(5) file.

  Ex.
  # Add a entry
  $mm->addMagicEntry("0\tstring\tabc\ttext/abc");
  # Add a entry with a sub entry
  $mm->addMagicEntry("0\tstring\tdef\t");
  $mm->addMagicEntry(">10\tstring\tghi\ttext/ghi");

=item $mm->readMagicHandle

=item $mm->checktype_filename

=item $mm->checktype_magic

=item $mm->checktype_contents

=head1 COPYRIGHT

This program is originated from file.kulp that is a production of The
Unix Reconstruction Projct.
   <http://language.perl.com/ppt/index.html>
Copyright (c) 1999 NOKUBI Takatsugu <knok@daionet.gr.jp>.

There is no warranty for the program.

This product includes software developed by the Apache Group
for use in the Apache HTTP server project (http://www.apache.org/).

License for the program is followed the original software. The license is
below.

This program is free and open software. You may use, copy, modify, distribute
and sell this program (and any modified variants) in any way you wish,
provided you do not restrict others to do the same, except for the following
consideration.

I read some of Ian F. Darwin's BSD C implementation, to
try to determine how some of this was done since the specification
is a little vague.  I don't believe that this perl version could
be construed as an "altered version", but I did grab the tokens for
identifying the hard-coded file types in names.h and copied some of
the man page.

Here's his notice:

 * Copyright (c) Ian F. Darwin, 1987.
 * Written by Ian F. Darwin.
 *
 * This software is not subject to any license of the American Telephone
 * and Telegraph Company or of the Regents of the University of California.
 *
 * Permission is granted to anyone to use this software for any purpose on
 * any computer system, and to alter it and redistribute it freely, subject
 * to the following restrictions:
 *
 * 1. The author is not responsible for the consequences of use of this
 *    software, no matter how awful, even if they arise from flaws in it.
 *
 * 2. The origin of this software must not be misrepresented, either by
 *    explicit claim or by omission.  Since few users ever read sources,
 *    credits must appear in the documentation.
 *
 * 3. Altered versions must be plainly marked as such, and must not be
 *    misrepresented as being the original software.  Since few users
 *    ever read sources, credits must appear in the documentation.
 *
 * 4. This notice may not be removed or altered.

The following is the Apache License. This program contains the magic file
that derived from the Apache HTTP Server.

 * Copyright (c) 1995-1999 The Apache Group.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in
 *    the documentation and/or other materials provided with the
 *    distribution.
 *
 * 3. All advertising materials mentioning features or use of this
 *    software must display the following acknowledgment:
 *    "This product includes software developed by the Apache Group
 *    for use in the Apache HTTP server project (http://www.apache.org/)."
 *
 * 4. The names "Apache Server" and "Apache Group" must not be used to
 *    endorse or promote products derived from this software without
 *    prior written permission. For written permission, please contact
 *    apache@apache.org.
 *
 * 5. Products derived from this software may not be called "Apache"
 *    nor may "Apache" appear in their names without prior written
 *    permission of the Apache Group.
 *
 * 6. Redistributions of any form whatsoever must retain the following
 *    acknowledgment:
 *    "This product includes software developed by the Apache Group
 *    for use in the Apache HTTP server project (http://www.apache.org/)."
 *
 * THIS SOFTWARE IS PROVIDED BY THE APACHE GROUP ``AS IS'' AND ANY
 * EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE APACHE GROUP OR
 * ITS CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 * NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.

=cut

use FileHandle;
use strict;

use vars qw(
%TEMPLATES %ESC $VERSION
$magicFile $checkMagic $followLinks $fileList
$allowEightbit
);

BEGIN {
# translation of type in magic file to unpack template and byte count
%TEMPLATES = (byte     => [ 'c', 1 ],
		 ubyte    => [ 'C', 1 ],
		 char     => [ 'c', 1 ],
		 uchar    => [ 'C', 1 ],
		 short    => [ 's', 2 ],
		 ushort   => [ 'S', 2 ],
		 long     => [ 'l', 4 ],
		 ulong    => [ 'L', 4 ],
		 date     => [ 'l', 4 ],
		 ubeshort => [ 'n', 2 ],
		 beshort  => [ [ 'n', 'S', 's' ], 2 ],
		 ubelong  => [   'N',             4 ],
		 belong   => [ [ 'N', 'I', 'i' ], 4 ],
		 bedate   => [   'N',             4 ],
		 uleshort => [   'v',             2 ],
		 leshort  => [ [ 'v', 'S', 's' ], 2 ],
		 ulelong  => [   'V',             4 ],
		 lelong   => [ [ 'V', 'I', 'i' ], 4 ],
		 ledate   => [   'V',             4 ],
		 string   => undef);

# for letter escapes in magic file
%ESC = ( n => "\n",
	    r => "\r",
	    b => "\b",
	    t => "\t",
	    f => "\f");

$VERSION = "1.27";
$allowEightbit = 1;
}

sub new {
    my $self = {};
    my $proto = shift;
    my $class = ref($proto) || $proto;
    $self->{MF} = [];
    $self->{magic} = [];
    if (! @_) {
	my $fh = *File::MMagic::DATA{IO};
	binmode($fh);
	bless $fh, 'FileHandle' if ref $fh ne 'FileHandle';
	my $dataLoc;
	# code block to localise the no strict;, contribute by Simon Matthews
	{
	    no strict 'refs';
	    my $instance = \${ "$class\::_instance" };
	    $$instance = $fh->tell() unless $$instance;
	    $dataLoc = $$instance;
	}

	$fh->seek($dataLoc, 0);
	&readMagicHandle($self, $fh);
    } else {
	my $filename = shift;
	my $fh = new FileHandle;
	if ($fh->open("< $filename")) {
	    binmode($fh);
	    &readMagicHandle($self, $fh);
	} else {
	    warn __PACKAGE__ . " couldn't load specified file $filename";
	}
    }

# from the BSD names.h, some tokens for hard-coded checks of
# different texts.  This isn't rocket science.  It's prone to
# failure so these checks are only a last resort.

# removSpecials() can be used to remove those afterwards.
    $self->{SPECIALS} = {
		 "message/rfc822" => [ "^Received:",   
			     "^>From ",       
			     "^From ",       
			     "^To: ",
			     "^Return-Path: ",
			     "^Cc: ",
			     "^X-Mailer: "],
		 "message/news" => [ "^Newsgroups: ", 
			     "^Path: ",       
			     "^X-Newsreader: "],
		 "text/html" => [ "<html[^>]*>",
			     "<HTML[^>]*>",
			     "<head[^>]*>",
			     "<HEAD[^>]*>",
			     "<body[^>]*>",
			     "<BODY[^>]*>",
			     "<title[^>]*>",
			     "<TITLE[^>]*>",
			     "<h1[^>]*>",
			     "<H1[^>]*>",
			],
		 "text/x-roff" => [
			      '^\\.\\\\"',
			      "^\\.SH ",
			      "^\\.PP ",
			      "^\\.TH ",
			      "^\\.BR ",
			      "^\\.SS ",
			      "^\\.TP ",
			      "^\\.IR ",
				   ],
		};

    $self->{FILEEXTS} = {
	     '\.gz$' => 'application/x-gzip',
	     '\.bz2$' => 'application/x-bzip2',
	     '\.Z$' => 'application/x-compress',
	     '\.txt$' => 'text/plain',
	     '\.html$' => 'text/html',
	     '\.htm$' => 'text/html',
    };
    bless($self);
    return $self;
}

sub addSpecials {
    my $self = shift;
    my $mtype = shift;
    $self->{SPECIALS}->{"$mtype"} = [@_];
    return $self;
}

sub removeSpecials {
    my $self = shift;
    # Remove all keys if no arguments given
    my @mtypes = (@_ or keys %{$self->{SPECIALS}});
    my %returnmtypes;
    foreach my $mtype (@mtypes) {
      $returnmtypes{"$mtype"} = delete $self->{SPECIALS}->{"$mtype"};
    }
    return %returnmtypes;
}

sub addFileExts {
    my $self = shift;
    my $filepat = shift;
    my $mtype = shift;
    $self->{FILEEXTS}->{"$filepat"} = $mtype;
    return $self;
}

sub removeFileExts {
    my $self = shift;
    # Remove all keys if no arguments given
    my @filepats = (@_ or keys %{$self->{FILEEXTS}}); 
    my %returnfilepats;
    foreach my $filepat (@filepats) {
      $returnfilepats{"$filepat"} = delete $self->{FILEEXTS}->{"$filepat"};
    }
    return %returnfilepats;
}

sub addMagicEntry {
    my $self = shift;
    my $entry = shift;
    if ($entry =~ /^>/) {
	$entry =~ s/^>//;
	my $depth = 1;
	my $entref = ${${$self->{magic}}[0]}[2];
	while ($entry =~ /^>/) {
	    $entry =~ s/^>//;
	    $depth ++;
	    $entref = ${${$entref}[0]}[2];
	}
	$entry = '>' x $depth . $entry;
	unshift @{$entref}, [$entry, -1, []];
	return $self;
    }
    unshift @{$self->{magic}}, [$entry, -1, []];
    return $self;
}

sub readMagicHandle {
    my $self = shift;
    my $fh = shift;
    $self->{MF}->[0] = $fh;
    $self->{MF}->[1] = undef;
    $self->{MF}->[2] = 0;
    readMagicEntry($self->{magic}, $self->{MF});
}

# Not implimented.
#
#sub readMagicFile {
#    my $self = shift;
#    my $mfile = shift;
#}

sub checktype_filename {
    my $self = shift;

# iterate over each file explicitly so we can seek
    my $file = shift;

    # the description line.  append info to this string
    my $desc;
    my $mtype;

    # 0) check permission
    if (! -r $file) {
	$desc .= " can't read `$file': Permission denied.";
	return "x-system/x-error; $desc";
    }

    # 1) check for various special files first
    if ($^O eq 'MSWin32') {
	stat($file);
    } else {
	if ($followLinks) { stat($file); } else { lstat($file); }
    }
    if (! -f _  or -z _) {
	if ( $^O ne 'MSWin32' && !$followLinks && -l _ ) { 
	    $desc .= " symbolic link to ".readlink($file); 
	}
	elsif ( -d _ ) { $desc .= " directory"; }
	elsif ( -p _ ) { $desc .= " named pipe"; }
	elsif ( -S _ ) { $desc .= " socket"; }
	elsif ( -b _ ) { $desc .= " block special file"; }
	elsif ( -c _ ) { $desc .= " character special file"; }
	elsif ( -z _ ) { $desc .= " empty"; }
	else { $desc .= " special"; }

	return "x-system/x-unix; $desc";
    }

    # current file handle.  or undef if checkMagic (-c option) is true.
    my $fh;

#    $fh = new FileHandle "< $file" or die "$F: $file: $!\n" ;
    $fh = new FileHandle "< $file" or return "x-system/x-error; $file: $!\n" ;

    binmode($fh); # for MSWin32

    # 2) check for script
    if (-x $file && -T _) {

	# Note, some magic files include elaborate attempts
	# to match #! header lines and return pretty responses
	# but this slows down matching and is unnecessary.
	my $line1 = <$fh>;
	if ($line1 =~ /^\#!\s*(\S+)/) {
	    $desc .= " executable $1 script text";
	}
	else { $desc .= " commands text"; }

	$fh->close();

	return "x-system/x-unix; $desc";

    }

    my $out = checktype_filehandle($self, $fh, $desc);
    undef $fh;

    return $out;
}

sub checktype_filehandle {
    my $self = shift;
    my ($fh, $desc) = @_;
    my $mtype;

    binmode($fh); # for MSWin32 architecture.

    # 3) iterate over each magic entry.
    my $matchFound = 0;
    my $m;
    for ($m = 0; $m <= $#{$self->{magic}}; $m++) {

	# check if the m-th magic entry matches
	# if it does, then $desc will contain an updated description
	if (magicMatch($self->{magic}->[$m],\$desc,$fh)) {
	    if (defined $desc && $desc ne '') {
		$matchFound = 1;
		$mtype = $desc;
		last;
	    }
	}

	# read another entry from the magic file if we've exhausted
	# all the entries already buffered.  readMagicEntry will
	# add to the end of the array if there are more.
	if ($m == $#{$self->{magic}} && !$self->{MF}->[0]->eof()) {
	    readMagicEntry($self->{magic}, $self->{MF});
	}
    }

    # 4) check if it's text or binary.
    # if it's text, then do a bunch of searching for special tokens
    if (!$matchFound) {
	my $data;
	$fh->seek(0,0);
	$fh->read($data, 0x8564);
	$mtype = checktype_data($self, $data);
    }

    $mtype = 'text/plain' if (! defined $mtype);

    return $mtype;
}

sub checktype_contents {
    my $self = shift;
    my $data = shift;
    my $mtype;

    return 'application/octet-stream' if (length($data) <= 0);

    $mtype = checktype_magic($self, $data);

    # 4) check if it's text or binary.
    # if it's text, then do a bunch of searching for special tokens
    if (!defined $mtype) {
	$mtype = checktype_data($self, $data);
    }

    $mtype = 'text/plain' if (! defined $mtype);

    return $mtype;
}

sub checktype_magic {
    my $self = shift;
    my $data = shift;
    my $desc;
    my $mtype;

    return 'application/octet-stream' if (length($data) <= 0);

    # 3) iterate over each magic entry.
    my $m;
    for ($m = 0; $m <= $#{$self->{magic}}; $m++) {

	# check if the m-th magic entry matches
	# if it does, then $desc will contain an updated description
	if (magicMatchStr($self->{magic}->[$m],\$desc,$data)) {
	    if (defined $desc && $desc ne '') {
		$mtype = $desc;
		last;
	    }
	}

	# read another entry from the magic file if we've exhausted
	# all the entries already buffered.  readMagicEntry will
	# add to the end of the array if there are more.
	if ($m == $#{$self->{magic}} && !$self->{MF}->[0]->eof()) {
	    readMagicEntry($self->{magic}, $self->{MF});
	}
    }

    return $mtype;
}

sub checktype_data {
    my $self = shift;
    my $data = shift;
    my $mtype;

    return undef if (length($data) <= 0);

    # truncate data
    $data = substr($data, 0, 0x8564);

    # at first, check SPECIALS
    {
	# in BSD's version, there's an effort to search from
	# more specific to less, but I don't do that.
	my %val;
	foreach my $type (keys %{$self->{SPECIALS}}) {
	    my $matched_pos = undef;
	    foreach my $token (@{$self->{SPECIALS}->{$type}}){ 
		pos($data) = 0;
		if ($data =~ /$token/mg) {
		    my $tmp =  pos($data);
		    if ((! defined $matched_pos) || ($matched_pos > $tmp)) {
			$matched_pos = $tmp;
		    }
		}
	    }
	    $val{$type} = $matched_pos if $matched_pos;
	}
	# search latest match
	if (%val) {
	    my @skeys = sort { $val{$a} <=> $val{$b} } keys %val;
	    $mtype = $skeys[0];
	}
	
#	$mtype = 'text/plain' if (! defined $mtype);
    }
    if (! defined $mtype && check_binary($data)) {
	$mtype = "application/octet-stream";
    }
	
#    $mtype = 'text/plain' if (! defined $mtype);
    return $mtype;
}

sub checktype_byfilename {
    my $self = shift;
    my $fname = shift;
    my $type;

    $fname =~ s/^.*\///;
    for my $regex (keys %{$self->{FILEEXTS}}) {
	if ($fname =~ /$regex/i) {
	    if ((defined $type && $type !~ /;/) || (! defined $type)) {
		$type = $self->{FILEEXTS}->{$regex}; # has no x-type param
	    }
	}
    }
    $type = 'application/octet-stream' unless defined $type;
    return $type;
}

sub check_binary {
    my ($data) = @_;
    my $len = length($data);
    if ($allowEightbit) {
	my $count = ($data =~ tr/\x00-\x08\x0b-\x0c\x0e-\x1a\x1c-\x1f//); # exclude TAB, ESC, nl, cr
        return 1 if ($len <= 0); # no contents
        return 1 if (($count/$len) > 0.1); # binary
    } else {
	my $count = ($data =~ tr/\x00-\x08\x0b-\x0c\x0e-\x1a\x1c-\x1f\x80-\xff//); # exclude TAB, ESC, nl, cr
        return 1 if ($len <= 0); # no contents
        return 1 if (($count/$len) > 0.3); # binary
    }
    return 0;
}

sub check_magic {
    my $self = shift @_;
    # read the whole file if we haven't already
    while (!$self->{MF}->[0]->eof()) {
	readMagicEntry($self->{magic}, $self->{MF});
    }
    dumpMagic($self->{magic});
}

####### SUBROUTINES ###########

# compare the magic item with the filehandle.
# if success, print info and return true.  otherwise return undef.
#
# this is called recursively if an item has subitems.
sub magicMatch {
    my ($item, $p_desc, $fh) = @_;

    # delayed evaluation.  if this is our first time considering
    # this item, then parse out its structure.  @$item is just the
    # raw string, line number, and subtests until we need the real info.
    # this saves time otherwise wasted parsing unused subtests.
    if (@$item == 3){
        my $tmp = readMagicLine(@$item);
        @$item = @$tmp;
    }

    # $item could be undef if we ran into troubles while reading
    # the entry.
    return unless defined($item);

    # $fh is not be defined if -c.  that way we always return
    # false for every item which allows reading/checking the entire
    # magic file.
    return unless defined($fh);
    
    my ($offtype, $offset, $numbytes, $type, $mask, $op, $testval, 
	$template, $message, $subtests) = @$item;

    # bytes from file
    my $data;

    # set to true if match
    my $match = 0;

    # offset = [ off1, sz, template, off2 ] for indirect offset
    if ($offtype == 1) {
	my ($off1, $sz, $template, $off2) = @$offset;
	$fh->seek($off1,0) or return;
	if ($fh->read($data,$sz) != $sz) { return };
	$off2 += unpack($template,$data);
	$fh->seek($off2,0) or return;
    }
    elsif ($offtype == 2) {
	# relative offsets from previous seek
	$fh->seek($offset,1) or return;
    }
    else {
	# absolute offset
	$fh->seek($offset,0) or return;
    }

    if ($type =~ /^string/) {
	# read the length of the match string unless the
	# comparison is '>' ($numbytes == 0), in which case 
	# read to the next null or "\n". (that's what BSD's file does)
	if ($numbytes > 0) {
	    if ($fh->read($data,$numbytes) != $numbytes) { return; }
	}
	else {
	    my $ch = $fh->getc();
	    while (defined($ch) && $ch ne "\0" && $ch ne "\n") {
		$data .= $ch;
		$ch = $fh->getc();
	    }
	}

	# now do the comparison
	if ($op eq '=') {
	    $match = ($data eq $testval);
	}
	elsif ($op eq '<') {
	    $match = ($data lt $testval);
	}
	elsif ($op eq '>') {
	    $match = ($data gt $testval);
	}
	# else bogus op, but don't die, just skip

	if ($checkMagic) {
	    print STDERR "STRING: $data $op $testval => $match\n";
	}

    }
    else {
	#numeric

	# read up to 4 bytes
	if ($fh->read($data,$numbytes) != $numbytes) { return; }

	# If template is a ref to an array of 3 letters, 
	# then this is an endian 
	# number which must be first unpacked into an unsigned and then
	# coerced into a signed.  Is there a better way?
	if (ref($template)) {
	    $data = unpack($$template[2],
			   pack($$template[1],
				unpack($$template[0],$data)));
	}
	else {
	    $data = unpack($template,$data);
	}

	# if mask
	if (defined($mask)) {
	    $data &= $mask;
	}

	# Now do the check
	if ($op eq '=') {
	    $match = ($data == $testval);
	}
	elsif ($op eq 'x') {
	    $match = 1;
	}
	elsif ($op eq '!') {
	    $match = ($data != $testval);
	}
	elsif ($op eq '&') {
	    $match = (($data & $testval) == $testval);
	}
	elsif ($op eq '^') {
	    $match = ((~$data & $testval) == $testval);
	}
	elsif ($op eq '<') {
	    $match = ($data < $testval);
	}
	elsif ($op eq '>') {
	    $match = ($data > $testval);
	}
	# else bogus entry that we're ignoring

	if ($checkMagic) {
	    print STDERR "NUMERIC: $data $op $testval => $match\n";
	}

    }

    if ($match) {
	# it's pretty common to find "\b" in the message, but
	# sprintf doesn't insert a backspace.  if it's at the
	# beginning (typical) then don't include separator space.
	if ($message =~ s/^\\b//) {
	    $$p_desc .= sprintf($message,$data);
	}
	else {
#	    $$p_desc .= ' ' . sprintf($message,$data) if $message;
	    $$p_desc .= sprintf($message,$data) if $message;
	}

	my $subtest;
	foreach $subtest (@$subtests) {
	    magicMatch($subtest,$p_desc,$fh);
	}

	return 1;
    }
    
}

sub magicMatchStr {
    my ($item, $p_desc, $str) = @_;
    my $origstr = $str;

    # delayed evaluation.  if this is our first time considering
    # this item, then parse out its structure.  @$item is just the
    # raw string, line number, and subtests until we need the real info.
    # this saves time otherwise wasted parsing unused subtests.
    if (@$item == 3){
	my $tmp = readMagicLine(@$item);

	# $item could be undef if we ran into troubles while reading
	# the entry.
	return unless defined($tmp);

	@$item = @$tmp;
    }

    # $fh is not be defined if -c.  that way we always return
    # false for every item which allows reading/checking the entire
    # magic file.
    return unless defined($str);
    return if ($str eq '');
    
    my ($offtype, $offset, $numbytes, $type, $mask, $op, $testval, 
	$template, $message, $subtests) = @$item;
    return unless defined $op;

    # bytes from file
    my $data;

    # set to true if match
    my $match = 0;

    # offset = [ off1, sz, template, off2 ] for indirect offset
    if ($offtype == 1) {
	my ($off1, $sz, $template, $off2) = @$offset;
	return if (length($str) < $off1);
	$data = pack("a$sz", $str);
	$off2 += unpack($template,$data);
	return if (length($str) < $off2);
    }
    elsif ($offtype == 2) {
	# can't handle relative offsets from previous seek
	return;
    }
    else {
	# absolute offset
	return if ($offset > length($str));
	$str = substr($str, $offset);
    }

    if ($type =~ /^string/) {
	# read the length of the match string unless the
	# comparison is '>' ($numbytes == 0), in which case 
	# read to the next null or "\n". (that's what BSD's file does)
	if ($numbytes > 0) {
	    $data = pack("a$numbytes", $str);
	}
	else {
	    $str =~ /^(.*)\0|$/;
	    $data = $1;
	}

	# now do the comparison
	if ($op eq '=') {
	    $match = ($data eq $testval);
	}
	elsif ($op eq '<') {
	    $match = ($data lt $testval);
	}
	elsif ($op eq '>') {
	    $match = ($data gt $testval);
	}
	# else bogus op, but don't die, just skip

	if ($checkMagic) {
	    print STDERR "STRING: $data $op $testval => $match\n";
	}

    }
    else {
	#numeric

	# read up to 4 bytes
        return if (length($str) < 4);
	$data = substr($str, 0, 4);

	# If template is a ref to an array of 3 letters, 
	# then this is an endian 
	# number which must be first unpacked into an unsigned and then
	# coerced into a signed.  Is there a better way?
	if (ref($template)) {
	    $data = unpack($$template[2],
			   pack($$template[1],
				unpack($$template[0],$data)));
	}
	else {
	    $data = unpack($template,$data);
	}

	# if mask
	if (defined($mask)) {
	    $data &= $mask;
	}

	# Now do the check
	if ($op eq '=') {
	    $match = ($data == $testval);
	}
	elsif ($op eq 'x') {
	    $match = 1;
	}
	elsif ($op eq '!') {
	    $match = ($data != $testval);
	}
	elsif ($op eq '&') {
	    $match = (($data & $testval) == $testval);
	}
	elsif ($op eq '^') {
	    $match = ((~$data & $testval) == $testval);
	}
	elsif ($op eq '<') {
	    $match = ($data < $testval);
	}
	elsif ($op eq '>') {
	    $match = ($data > $testval);
	}
	# else bogus entry that we're ignoring

	if ($checkMagic) {
	    print STDERR "NUMERIC: $data $op $testval => $match\n";
	}

    }

    if ($match) {
	# it's pretty common to find "\b" in the message, but
	# sprintf doesn't insert a backspace.  if it's at the
	# beginning (typical) then don't include separator space.
	if ($message =~ s/^\\b//) {
	    $$p_desc .= sprintf($message,$data);
	}
	else {
#	    $$p_desc .= ' ' . sprintf($message,$data) if $message;
	    $$p_desc .= sprintf($message,$data) if $message;
	}

	my $subtest;
	foreach $subtest (@$subtests) {
	    # finish evaluation when matched.
	    magicMatchStr($subtest,$p_desc,$origstr);
	}

	return 1;
    }
    
}

# readMagicEntry($pa_magic, $MF, $depth)
#
# reads the next entry from the magic file and stores it as
# a ref to an array at the end of @$pa_magic.
#
# $MF = [ filehandle, last buffered line, line count ]
#
# This is called recursively with increasing $depth to read in sub-clauses
#
# returns the depth of the current buffered line.
#
sub readMagicEntry {
    my ($pa_magic, $MF, $depth) = @_;

    # for some reason I need a local var because <$$MF[0]> doesn't work.(?)
    my $magicFH = $$MF[0];

    # a ref to an array containing a magic line's components
    my ($entry, $line);

    $line = $$MF[1];		# buffered last line
    while (1) {
	$line = '' if (! defined $line);
	if ($line =~ /^\#/ || $line =~ /^\s*$/) {
	    last if $magicFH->eof();
	    $line = <$magicFH>;
	    $$MF[2]++;
	    next;
	}
	
	my ($thisDepth) = ($line =~ /^(>+)/);
	$thisDepth = '' if (! defined $thisDepth);
	$depth = 0 if (! defined $depth);

	if (length($thisDepth) > $depth) {
	    $$MF[1] = $line;

	    # call ourselves recursively.  will return the depth
	    # of the entry following the nested group.
	    if ((readMagicEntry($entry->[2], $MF, $depth+1) || 0) < $depth ||
		$$MF[0]->eof())
	    {
		return;
	    }
	    $line = $$MF[1];
	}
	elsif (length($thisDepth) < $depth) {
	    $$MF[1] = $line;
	    return length($thisDepth);
	}
	elsif (defined(@$entry)) {
	    # already have an entry.  this is not a continuation.
	    # save this line for the next call and exit.
	    $$MF[1] = $line;
	    return length($thisDepth);
	}
	else {
	    # we're here if the number of '>' is the same as the
	    # current depth and we haven't read a magic line yet.

	    # create temp entry
	    # later -- if we ever get around to evaluating this condition --
	    # we'll replace @$entry with the results from readMagicLine.
	    $entry = [ $line , $$MF[2], [] ];

	    # add to list
	    push(@$pa_magic,$entry);

	    # read the next line
	    last if $magicFH->eof();
	    $line = <$magicFH>;
	    $$MF[2]++;
	}
    }
}

# readMagicLine($line, $line_num, $subtests)
#
# parses the match info out of $line.  Returns a reference to an array.
#
#  Format is:
#
# [ offset, bytes, type, mask, operator, testval, template, sprintf, subtests ]
#     0      1      2       3        4         5        6        7      8
#
# subtests is an array like @$pa_magic.
#
sub readMagicLine {
    my ($line, $line_num, $subtests) = @_;

    my ($offtype, $offset, $numbytes, $type, $mask, 
	$operator, $testval, $template, $message);
    
    # this would be easier if escaped whitespace wasn't allowed.

    # grab the offset and type.  offset can either be a decimal, oct,
    # or hex offset or an indirect offset specified in parenthesis
    # like (x[.[bsl]][+-][y]), or a relative offset specified by &.
    # offtype : 0 = absolute, 1 = indirect, 2 = relative
    if ($line =~ s/^>*([&\(]?[a-fA-Flsx\.\+\-\d]+\)?)\s+(\S+)\s+//) {
	($offset,$type) = ($1,$2);

	if ($offset =~ /^\(/) {
	    # indirect offset.  
	    $offtype = 1;

	    # store as a reference [ offset1 type template offset2 ]

	    my ($o1,$type,$o2);
	    if (($o1,$type,$o2) = ($offset =~ /\((\d+)(\.[bsl])?([\+\-]?\d+)?\)/))
	    {
		$o1 = oct($o1) if $o1 =~ /^0/o;
		$o2 = oct($o2) if $o2 =~ /^0/o;

		$type =~ s/\.//;
		if ($type eq '') { $type = 'l'; }  # default to long
		$type =~ tr/b/c/; # type will be template for unpack

		my $sz = $type;	  # number of bytes
		$sz =~ tr/csl/124/;

		$offset = [ $o1,$sz,$type,int($o2) ];
	    } else {
		warn "Bad indirect offset at line $line_num. '$offset'\n";
		return;
	    }
	}
	elsif ($offset =~ /^&/o) {
	    # relative offset
	    $offtype = 2;

	    $offset = substr($offset,1);
	    $offset = oct($offset) if $offset =~ /^0/o;
	}
	else {
	    # normal absolute offset
	    $offtype = 0;

	    # convert if needed
	    $offset = oct($offset) if $offset =~ /^0/o;
	}
    }
    else {
	warn "Bad Offset/Type at line $line_num. '$line'\n";
	return;
    }
    
    # check for & operator on type
    if ($type =~ s/&(.*)//) {
	$mask = $1;

	# convert if needed
	$mask = oct($mask) if $mask =~ /^0/o;
    }
    
    # check if type is valid
    if (!exists($TEMPLATES{$type}) && $type !~ /^string/) {
	warn "Invalid type '$type' at line $line_num\n";
	return;
    }
    
    # take everything after the first non-escaped space
    if ($line =~ s/([^\\])\s+(.*)/$1/) {
	$message = $2;
    }
    else {
	warn "Missing or invalid test condition or message at line $line_num\n";
	return;
    }
    
    # remove the return if it's still there
    $line =~ s/\n$//o;

    # get the operator.  if 'x', must be alone.  default is '='.
    if ($line =~ s/^([><&^=!])//o) {
	$operator = $1;
    }
    elsif ($line eq 'x') {
	$operator = 'x';
    }
    else { $operator = '='; }
    

    if ($type =~ /string/) {
	$testval = $line;

	# do octal/hex conversion
	$testval =~ s/\\([x0-7][0-7]?[0-7]?)/chr(oct($1))/eg;

	# do single char escapes
	$testval =~ s/\\(.)/$ESC{$1}||$1/eg;

	# put the number of bytes to read in numbytes.
	# '0' means read to \0 or \n.
	if ($operator =~ /[>x]/o) {
	    $numbytes = 0;
	}
	elsif ($operator =~ /[=<]/o) {
	    $numbytes = length($testval);
	}
	elsif ($operator eq '!') {
	    # annoying special case.  ! operator only applies to numerics so
	    # put it back.
	    $testval = $operator . $testval;
	    $numbytes = length($testval);
	    $operator = '=';
	}
	else {
	    # there's a bug in my magic file where there's
	    # a line that says "0	string	^!<arc..." and the BSD
	    # file program treats the argument like a numeric.  To minimize
	    # hassles, complain about bad ops only if -c is set.
	    warn "Invalid operator '$operator' for type 'string' at line $line_num.\n"
	      if $checkMagic;
	    return;
	}
    }
    else {
	# numeric
	if ($operator ne 'x') {
	    # this conversion is very forgiving.  it's faster and
	    # it doesn't complain about bugs in popular magic files,
	    # but it will silently turn a string into zero.
	    if ($line =~ /^0/o) {
		$testval = oct($line);
	    } else {
		$testval = int($line);
	    }
	}

	($template,$numbytes) = @{$TEMPLATES{$type}};

	# unset coercion of $unsigned unless we're doing order comparison
	if (ref($template)) {
	    $template = $$template[0]
	      unless $operator eq '>' || $operator eq '<';
	}
    }
    
    return [ $offtype, $offset, $numbytes, $type, $mask,
	    $operator, $testval, $template, $message, $subtests ];
}

# recursively write the magic file to stderr.  Numbers are written
# in decimal.
sub dumpMagic {
    my ($magic,$depth) = @_;
    $magic = [] unless defined $magic;
    $depth = 0 unless defined $depth;

    my $entry;
    foreach $entry (@$magic) {
	# delayed evaluation.
        if (@$entry == 3){
            my $tmp = readMagicLine(@$entry);
            @$entry = @$tmp;
        }

	next if !defined($entry);

	my ($offtype, $offset, $numbytes, $type, $mask, $op, $testval, 
	    $template, $message, $subtests) = @$entry;

	print STDERR '>'x$depth;
	if ($offtype == 1) {
	    $offset->[2] =~ tr/c/b/; 
	    print STDERR "($offset->[0].$offset->[2]$offset->[3])";
	}
	elsif ($offtype == 2) {
	    print STDERR "&",$offset;
	}
	else {
	    # offtype == 0
	    print STDERR $offset;
	}
	print STDERR "\t",$type;
	if ($mask) { print STDERR "&",$mask; }
	print STDERR "\t",$op,$testval,"\t",$message,"\n";

	if ($subtests) {
	    dumpMagic($subtests,$depth+1);
	}
    }
}

1;
__DATA__
# Magic data for mod_mime_magic Apache module (originally for file(1) command)
# The module is described in htdocs/manual/mod/mod_mime_magic.html
#
# The format is 4-5 columns:
#    Column #1: byte number to begin checking from, ">" indicates continuation
#    Column #2: type of data to match
#    Column #3: contents of data to match
#    Column #4: MIME type of result
#    Column #5: MIME encoding of result (optional)

#------------------------------------------------------------------------------
# Localstuff:  file(1) magic for locally observed files
# Add any locally observed files here.
#

# The following paramaters are created for Namazu.
# <http://www.namazu.org/>
#
# 1999/08/13
#0	string		\<!--\ MHonArc		text/html; x-type=mhonarc
0	string		BZh			application/x-bzip2

# The following paramaters are local hack.
#
# 1999/09/09
# VRML (suggested by Masao Takaku)
0	string		#VRML\ V1.0\ ascii	model/vrml
0	string		#VRML\ V2.0\ utf8	model/vrml

#------------------------------------------------------------------------------
# end local stuff
#------------------------------------------------------------------------------

#------------------------------------------------------------------------------
# html:  file(1) magic for HTML (HyperText Markup Language) docs
#
# from Daniel Quinlan <quinlan@yggdrasil.com>
#
0	string		\<!DOCTYPE\ HTML	text/html
0	string		\<!DOCTYPE\ html	text/html
0	string		\<HEAD		text/html
0	string		\<head		text/html
0	string		\<TITLE		text/html
0	string		\<title		text/html
0       string          \<html          text/html
0       string          \<HTML          text/html
0	string		\<!--		text/html
0	string		\<h1		text/html
0	string		\<H1		text/html

#------------------------------------------------------------------------------
# mail.news:  file(1) magic for mail and news
#
# There are tests to ascmagic.c to cope with mail and news.
0	string		Relay-Version: 	message/rfc822
0	string		#!\ rnews	message/rfc822
0	string		N#!\ rnews	message/rfc822
0	string		Forward\ to 	message/rfc822
0	string		Pipe\ to 	message/rfc822
0	string		Return-Path:	message/rfc822
0	string		Received:	message/rfc822
0	string		Path:		message/news
0	string		Xref:		message/news
0	string		From:		message/rfc822
0	string		Article 	message/news

# Acrobat
# (due to clamen@cs.cmu.edu)
0	string		%PDF-		application/pdf

# ZIP archiver
0		string	PK				application/x-zip

#------------------------------------------------------------------------------
# msword: file(1) magic for MS Word files
#
# Contributor claims:
# Reversed-engineered MS Word magic numbers
#

0	string		\376\067\0\043			application/msword
#0	string		\320\317\021\340\241\261	application/msword
0	string		\333\245-\0\0\0			application/msword

#------------------------------------------------------------------------------
# Java

0	short		0xcafe
>2	short		0xbabe		application/java

#------------------------------------------------------------------------------
# audio:  file(1) magic for sound formats
#
# from Jan Nicolai Langfeldt <janl@ifi.uio.no>,
#

# Sun/NeXT audio data
0	string		.snd
>12	belong		1		audio/basic
>12	belong		2		audio/basic
>12	belong		3		audio/basic
>12	belong		4		audio/basic
>12	belong		5		audio/basic
>12	belong		6		audio/basic
>12	belong		7		audio/basic

>12	belong		23		audio/x-adpcm

# DEC systems (e.g. DECstation 5000) use a variant of the Sun/NeXT format
# that uses little-endian encoding and has a different magic number
# (0x0064732E in little-endian encoding).
0	lelong		0x0064732E	
>12	lelong		1		audio/x-dec-basic
>12	lelong		2		audio/x-dec-basic
>12	lelong		3		audio/x-dec-basic
>12	lelong		4		audio/x-dec-basic
>12	lelong		5		audio/x-dec-basic
>12	lelong		6		audio/x-dec-basic
>12	lelong		7		audio/x-dec-basic
#                                       compressed (G.721 ADPCM)
>12	lelong		23		audio/x-dec-adpcm

# Bytes 0-3 of AIFF, AIFF-C, & 8SVX audio files are "FORM"
#					AIFF audio data
8	string		AIFF		audio/x-aiff	
#					AIFF-C audio data
8	string		AIFC		audio/x-aiff	
#					IFF/8SVX audio data
8	string		8SVX		audio/x-aiff	

# Creative Labs AUDIO stuff
#					Standard MIDI data
0	string	MThd			audio/unknown	
#>9 	byte	>0			(format %d)
#>11	byte	>1			using %d channels
#					Creative Music (CMF) data
0	string	CTMF			audio/unknown	
#					SoundBlaster instrument data
0	string	SBI			audio/unknown	
#					Creative Labs voice data
0	string	Creative\ Voice\ File	audio/unknown	
## is this next line right?  it came this way...
#>19	byte	0x1A
#>23	byte	>0			- version %d
#>22	byte	>0			\b.%d

# [GRR 950115:  is this also Creative Labs?  Guessing that first line
#  should be string instead of unknown-endian long...]
#0	long		0x4e54524b	MultiTrack sound data
#0	string		NTRK		MultiTrack sound data
#>4	long		x		- version %ld

# Microsoft WAVE format (*.wav)
# [GRR 950115:  probably all of the shorts and longs should be leshort/lelong]
#					Microsoft RIFF
#0	string		RIFF		audio/x-msvideo	
0	string		RIFF
#					- WAVE format
>8	string		WAVE		audio/x-wav

#------------------------------------------------------------------------------
# c-lang:  file(1) magic for C programs or various scripts
#

# XPM icons (Greg Roelofs, newt@uchicago.edu)
# ideally should go into "images", but entries below would tag XPM as C source
0	string		/*\ XPM		image/x-xbm

# this first will upset you if you're a PL/1 shop... (are there any left?)
# in which case rm it; ascmagic will catch real C programs
#					C or REXX program text
0	string		/*		text/plain
#					C++ program text
0	string		//		text/plain

#------------------------------------------------------------------------------
# compress:  file(1) magic for pure-compression formats (no archives)
#
# compress, gzip, pack, compact, huf, squeeze, crunch, freeze, yabba, whap, etc.
#
# Formats for various forms of compressed data
# Formats for "compress" proper have been moved into "compress.c",
# because it tries to uncompress it to figure out what's inside.

# standard unix compress
#0	string		\037\235	application/octet-stream	x-compress
0	string		\037\235	application/x-compress

# gzip (GNU zip, not to be confused with [Info-ZIP/PKWARE] zip archiver)
#0       string          \037\213        application/octet-stream	x-gzip
0       string          \037\213        application/x-gzip

# According to gzip.h, this is the correct byte order for packed data.
0	string		\037\036	application/octet-stream
#
# This magic number is byte-order-independent.
#
0	short		017437		application/octet-stream

# XXX - why *two* entries for "compacted data", one of which is
# byte-order independent, and one of which is byte-order dependent?
#
# compacted data
0	short		0x1fff		application/octet-stream
0	string		\377\037	application/octet-stream
# huf output
0	short		0145405		application/octet-stream

# Squeeze and Crunch...
# These numbers were gleaned from the Unix versions of the programs to
# handle these formats.  Note that I can only uncrunch, not crunch, and
# I didn't have a crunched file handy, so the crunch number is untested.
#				Keith Waclena <keith@cerberus.uchicago.edu>
#0	leshort		0x76FF		squeezed data (CP/M, DOS)
#0	leshort		0x76FE		crunched data (CP/M, DOS)

# Freeze
#0	string		\037\237	Frozen file 2.1
#0	string		\037\236	Frozen file 1.0 (or gzip 0.5)

# lzh?
#0	string		\037\240	LZH compressed data

#------------------------------------------------------------------------------
# frame:  file(1) magic for FrameMaker files
#
# This stuff came on a FrameMaker demo tape, most of which is
# copyright, but this file is "published" as witness the following:
#
0	string		\<MakerFile	application/x-frame
0	string		\<MIFFile	application/x-frame
0	string		\<MakerDictionary	application/x-frame
0	string		\<MakerScreenFon	application/x-frame
0	string		\<MML		application/x-frame
0	string		\<Book		application/x-frame
0	string		\<Maker		application/x-frame

#------------------------------------------------------------------------------
# images:  file(1) magic for image formats (see also "c-lang" for XPM bitmaps)
#
# originally from jef@helios.ee.lbl.gov (Jef Poskanzer),
# additions by janl@ifi.uio.no as well as others. Jan also suggested
# merging several one- and two-line files into here.
#
# XXX - byte order for GIF and TIFF fields?
# [GRR:  TIFF allows both byte orders; GIF is probably little-endian]
#

# [GRR:  what the hell is this doing in here?]
#0	string		xbtoa		btoa'd file

# PBMPLUS
#					PBM file
0	string		P1		image/x-portable-bitmap
#					PGM file
0	string		P2		image/x-portable-greymap
#					PPM file
0	string		P3		image/x-portable-pixmap
#					PBM "rawbits" file
0	string		P4		image/x-portable-bitmap
#					PGM "rawbits" file
0	string		P5		image/x-portable-greymap
#					PPM "rawbits" file
0	string		P6		image/x-portable-pixmap

# NIFF (Navy Interchange File Format, a modification of TIFF)
# [GRR:  this *must* go before TIFF]
0	string		IIN1		image/x-niff

# TIFF and friends
#					TIFF file, big-endian
0	string		MM		image/tiff
#					TIFF file, little-endian
0	string		II		image/tiff

# possible GIF replacements; none yet released!
# (Greg Roelofs, newt@uchicago.edu)
#
# GRR 950115:  this was mine ("Zip GIF"):
#					ZIF image (GIF+deflate alpha)
0	string		GIF94z		image/unknown
#
# GRR 950115:  this is Jeremy Wohl's Free Graphics Format (better):
#					FGF image (GIF+deflate beta)
0	string		FGF95a		image/unknown
#
# GRR 950115:  this is Thomas Boutell's Portable Bitmap Format proposal
# (best; not yet implemented):
#					PBF image (deflate compression)
0	string		PBF		image/unknown

# GIF
0	string		GIF		image/gif

# JPEG images
0	beshort		0xffd8		image/jpeg

# PC bitmaps (OS/2, Windoze BMP files)  (Greg Roelofs, newt@uchicago.edu)
0	string		BM		image/bmp
#>14	byte		12		(OS/2 1.x format)
#>14	byte		64		(OS/2 2.x format)
#>14	byte		40		(Windows 3.x format)
#0	string		IC		icon
#0	string		PI		pointer
#0	string		CI		color icon
#0	string		CP		color pointer
#0	string		BA		bitmap array

# PNG images
# Suggested by Jamie LeTual.
0	string		\211PNG		image/png

#------------------------------------------------------------------------------
# lisp:  file(1) magic for lisp programs
#
# various lisp types, from Daniel Quinlan (quinlan@yggdrasil.com)
0	string	;;			text/plain
# Emacs 18 - this is always correct, but not very magical.
0	string	\012(			application/x-elc
# Emacs 19
0	string	;ELC\023\000\000\000	application/x-elc

#------------------------------------------------------------------------------
# printer:  file(1) magic for printer-formatted files
#

# PostScript
0	string		%!		application/postscript
0	string		\004%!		application/postscript
# EPS
# Jason's support for EPSF <jmaggard@timesdispatch.com>
47 string  EPSF  image/eps

#------------------------------------------------------------------------------
# sc:  file(1) magic for "sc" spreadsheet
#
38	string		Spreadsheet	application/x-sc

#------------------------------------------------------------------------------
# tex:  file(1) magic for TeX files
#
# XXX - needs byte-endian stuff (big-endian and little-endian DVI?)
#
# From <conklin@talisman.kaleida.com>

# Although we may know the offset of certain text fields in TeX DVI
# and font files, we can't use them reliably because they are not
# zero terminated. [but we do anyway, christos]
0	string		\367\002	application/x-dvi
#0	string		\367\203	TeX generic font data
#0	string		\367\131	TeX packed font data
#0	string		\367\312	TeX virtual font data
#0	string		This\ is\ TeX,	TeX transcript text	
#0	string		This\ is\ METAFONT,	METAFONT transcript text

# There is no way to detect TeX Font Metric (*.tfm) files without
# breaking them apart and reading the data.  The following patterns
# match most *.tfm files generated by METAFONT or afm2tfm.
#2	string		\000\021	TeX font metric data
#2	string		\000\022	TeX font metric data
#>34	string		>\0		(%s)

# Texinfo and GNU Info, from Daniel Quinlan (quinlan@yggdrasil.com)
0	string		\\input\ texinfo		text/x-texinfo
0	string		This\ is\ Info\ file	text/x-info
#0	string		This\ is\ 				text/x-info

# correct TeX magic for Linux (and maybe more)
# from Peter Tobias (tobias@server.et-inf.fho-emden.de)
#
0	leshort		0x02f7		application/x-dvi

# RTF - Rich Text Format
0	string		{\\rtf		application/rtf

#------------------------------------------------------------------------------
# animation:  file(1) magic for animation/movie formats
#
# animation formats, originally from vax@ccwf.cc.utexas.edu (VaX#n8)
#						MPEG file
0	string		\000\000\001\263	video/mpeg
#
# The contributor claims:
#   I couldn't find a real magic number for these, however, this
#   -appears- to work.  Note that it might catch other files, too,
#   so BE CAREFUL!
#
# Note that title and author appear in the two 20-byte chunks
# at decimal offsets 2 and 22, respectively, but they are XOR'ed with
# 255 (hex FF)! DL format SUCKS BIG ROCKS.
#
#						DL file version 1 , medium format (160x100, 4 images/screen)
0	byte		1			video/unknown
0	byte		2			video/unknown

#------------------------------------------------------------------------------
# ichitaro456: file(1) magic for Just System Word Processor Ichitaro
#
# Contributor kenzo-:
# Reversed-engineered JS Ichitaro magic numbers
#

0	string		DOC
>43	byte		0x14		application/ichitaro4
>144	string	JDASH		application/ichitaro4

0	string		DOC
>43	byte		0x15		application/ichitaro5

0	string		DOC
>43	byte		0x16		application/ichitaro6

#------------------------------------------------------------------------------
# office97: file(1) magic for MicroSoft Office files
#
# Contributor kenzo-:
# Reversed-engineered MS Office magic numbers
#

#0       string          \320\317\021\340\241\261\032\341
#>48     byte            0x1B            application/excel

2080	string	Microsoft\ Excel\ 5.0\ Worksheet	application/excel
2114	string	Biff5								application/excel

0       string	\224\246\056	application/msword

0		belong	0x31be0000		application/msword

0		string	PO^Q`			application/msword

0	string		\320\317\021\340\241\261\032\341
>546	string	bjbj			application/msword
>546	string	jbjb			application/msword

512		string	R\0o\0o\0t\0\ \0E\0n\0t\0r\0y	application/msword

2080	string	Microsoft\ Word\ 6.0\ Document	application/msword
2080	string	Documento\ Microsoft\ Word\ 6	application/msword
2112	string	MSWordDoc						application/msword

#0	string		\320\317\021\340\241\261\032\341	application/powerpoint
0	string		\320\317\021\340\241\261\032\341	application/msword

#
# MPEG audio/video format
# Contributer: Peter Breton
#

0	belong		0x000001b3	video/mpeg
0	belong		0x000001ba	video/mpeg
0	beshort		&0xffe0		audio/mpeg

#
# QuickTime format
# Contributer: Peter Breton
#

0	string		MOVI		video/quicktime
4	string		moov		video/quicktime
4	string		mdat		video/quicktime

# WinNT/WinCE PE files (Warner Losh, imp@village.org)
#
128		string	PE\000\000		application/octet-stream
0		string	PE\000\000		application/octet-stream

# miscellaneous formats
0		string	LZ				application/octet-stream

# .EXE formats (Greg Roelofs, newt@uchicago.edu)
#
0		string	MZ
>24		string	@				application/octet-stream

0		string	MZ
>30		string	Copyright\ 1989-1990\ PKWARE\ Inc.	application/x-zip

0		string	MZ
>30		string	PKLITE\ Copr.	application/x-zip

0		string	MZ
>36		string	LHa's\ SFX		application/x-lha

0		string	MZ
>36		string	LHA's\ SFX		application/x-lha

0		string	MZ				application/octet-stream

# LHA archiver
2		string	-lh
>6		string	-				application/x-lha

# POSIX tar archives
257		string	ustar\0			application/x-tar
257		string	ustar\040\040\0	application/x-gtar

# TNEF file
0		lelong	0x223E9F78	application/ms-tnef

# ARC archiver
0	lelong&0x8080ffff	0x0000081a	application/x-arc
0	lelong&0x8080ffff	0x0000091a	application/x-arc
0	lelong&0x8080ffff	0x0000021a	application/x-arc
0	lelong&0x8080ffff	0x0000031a	application/x-arc
0	lelong&0x8080ffff	0x0000041a	application/x-arc
0	lelong&0x8080ffff	0x0000061a	application/x-arc
# Zoo archiver
20	lelong		0xfdc4a7dc	application/x-zoo
# ARJ archiver (jason@jarthur.Claremont.EDU)
0	leshort		0xea60		application/x-arj
# RAR archiver (Greg Roelofs, newt@uchicago.edu)
0	string		Rar!		application/x-rar

